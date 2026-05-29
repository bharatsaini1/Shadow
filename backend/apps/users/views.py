import html
import requests as http_requests
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import User
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
    DashboardSerializer,
    PassportSerializer,
)
from apps.simulations.models import SimulationSession
from apps.tasks.models import UserBadge
from apps.interviews.models import InterviewSession


def sanitize(value):
    if isinstance(value, str):
        return html.escape(value)
    return value


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"].strip().lower()
        name = sanitize(serializer.validated_data["name"].strip())
        password = serializer.validated_data["password"]

        if len(password) < 8:
            return Response({"error": "Password must be at least 8 characters."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User(email=email, name=name)
        user.set_password(password)
        user.save()

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        return Response({
            "user": UserSerializer(user).data,
            "user_id": str(user.id),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")

        return Response({
            "user": UserSerializer(user).data,
            "user_id": str(user.id),
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"status": "logged out"}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "user": UserSerializer(request.user).data,
            "user_id": str(request.user.id),
        }, status=status.HTTP_200_OK)


GOOGLE_CLIENT_ID = "878633883717-vo9bsd12ssp0qmp8k8kufi5rkvq0amud.apps.googleusercontent.com"


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("credential")
        if not token:
            return Response({"error": "Missing Google credential"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            resp = http_requests.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": token},
                timeout=10,
            )
            if resp.status_code != 200:
                return Response({"error": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)

            payload = resp.json()
            email = payload.get("email", "").lower()
            name = payload.get("name", "")
            picture = payload.get("picture", "")

            if not email:
                return Response({"error": "No email in Google token"}, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "name": sanitize(name),
                    "avatar_url": picture,
                },
            )

            if created:
                user.set_unusable_password()
                user.save()

            login(request, user, backend="django.contrib.auth.backends.ModelBackend")

            return Response({
                "user": UserSerializer(user).data,
                "user_id": str(user.id),
                "created": created,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Google authentication failed: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if str(request.user.id) != str(user_id):
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        active_sessions = list(
            SimulationSession.objects.filter(user=user, status="active").values(
                "id", "career_track__name", "current_day", "total_days", "xp_earned", "status"
            )
        )
        for s in active_sessions:
            s["id"] = str(s["id"])
            s["career_track"] = s.pop("career_track__name", "")

        completed_sessions = list(
            SimulationSession.objects.filter(user=user, status="completed").values(
                "id", "career_track__name", "xp_earned", "industry_readiness_score",
                "difficulty", "total_days", "completed_at"
            )
        )
        for s in completed_sessions:
            s["id"] = str(s["id"])
            s["career_track"] = s.pop("career_track__name", "")
            if s["completed_at"]:
                s["completed_at"] = s["completed_at"].isoformat()

        recent_interviews = list(
            InterviewSession.objects.filter(user=user, status="completed").order_by("-completed_at")[:5].values(
                "id", "interview_type", "role", "overall_score", "completed_at"
            )
        )
        for iv in recent_interviews:
            iv["id"] = str(iv["id"])
            if iv["completed_at"]:
                iv["completed_at"] = iv["completed_at"].isoformat()

        user_badges = UserBadge.objects.filter(user=user).select_related("badge")
        badges_data = [
            {
                "slug": ub.badge.slug,
                "name": sanitize(ub.badge.name),
                "description": sanitize(ub.badge.description),
                "icon_url": ub.badge.icon_url,
                "awarded_at": ub.awarded_at.isoformat(),
            }
            for ub in user_badges
        ]

        leaderboard_users = list(
            User.objects.order_by("-xp_total")[:10].values("id", "name", "xp_total", "career_level")
        )
        for entry in leaderboard_users:
            entry["id"] = str(entry["id"])
            entry["name"] = sanitize(entry["name"])
            entry["xp"] = entry.pop("xp_total", 0)

        user_in_leaderboard = any(e["id"] == str(user.id) for e in leaderboard_users)
        if not user_in_leaderboard:
            leaderboard_users.append({
                "id": str(user.id),
                "name": sanitize(user.name),
                "xp": user.xp_total,
                "career_level": user.career_level,
            })

        avg_interview_scores = list(
            InterviewSession.objects.filter(
                user=user, status="completed", overall_score__isnull=False
            ).values_list("overall_score", flat=True)
        )
        avg_interview_score = round(sum(avg_interview_scores) / len(avg_interview_scores), 1) if avg_interview_scores else 0

        data = {
            "user": {
                "name": user.name,
                "email": user.email,
                "subscription_plan": user.subscription_plan,
            },
            "xp_total": user.xp_total,
            "career_level": user.career_level,
            "daily_streak": user.daily_streak,
            "subscription_plan": user.subscription_plan,
            "active_simulations": active_sessions,
            "completed_simulations": completed_sessions,
            "recent_interviews": recent_interviews,
            "avg_interview_score": avg_interview_score,
            "badges": badges_data,
            "leaderboard": leaderboard_users,
        }
        return Response(data, status=status.HTTP_200_OK)


class PassportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        if str(request.user.id) != str(user_id):
            return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        sessions = SimulationSession.objects.filter(user=user).values(
            "id", "career_track__name", "status", "xp_earned",
            "industry_readiness_score", "started_at", "completed_at",
        )
        sessions_data = []
        for s in sessions:
            s["id"] = str(s["id"])
            s["career_track__name"] = sanitize(s.get("career_track__name", ""))
            if s["completed_at"]:
                s["completed_at"] = s["completed_at"].isoformat()
            if s["started_at"]:
                s["started_at"] = s["started_at"].isoformat()
            sessions_data.append(s)

        interviews = user.interviews.filter(status="completed").values(
            "id", "interview_type", "overall_score", "communication_score",
            "technical_score", "completed_at",
        )
        interview_data = []
        for iv in interviews:
            iv["id"] = str(iv["id"])
            if iv["completed_at"]:
                iv["completed_at"] = iv["completed_at"].isoformat()
            interview_data.append(iv)

        user_badges = UserBadge.objects.filter(user=user).select_related("badge")
        badges_data = [
            {
                "slug": ub.badge.slug,
                "name": sanitize(ub.badge.name),
                "description": sanitize(ub.badge.description),
                "icon_url": ub.badge.icon_url,
            }
            for ub in user_badges
        ]

        readiness_scores = list(
            SimulationSession.objects.filter(user=user, industry_readiness_score__isnull=False)
            .values_list("industry_readiness_score", flat=True)
        )
        industry_readiness = round(sum(readiness_scores) / len(readiness_scores), 2) if readiness_scores else 0.0

        data = {
            "user": UserSerializer(user).data,
            "simulations": sessions_data,
            "interview_scores": interview_data,
            "badges": badges_data,
            "total_xp": user.xp_total,
            "career_level": user.career_level,
            "industry_readiness": industry_readiness,
        }
        return Response(data, status=status.HTTP_200_OK)
