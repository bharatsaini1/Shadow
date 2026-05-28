from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

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


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        name = serializer.validated_data["name"]
        password = serializer.validated_data["password"]

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User(email=email, name=name)
        user.set_password(password)
        user.save()
        token = Token.objects.create(user=user)

        return Response(
            {
                "token": token.key,
                "user_id": str(user.id),
                "email": user.email,
                "name": user.name,
                "subscription_plan": user.subscription_plan,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {
                "token": token.key,
                "user_id": str(user.id),
                "email": user.email,
                "name": user.name,
                "subscription_plan": user.subscription_plan,
            },
            status=status.HTTP_200_OK,
        )


class DashboardView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        active_sessions = [
            {
                "id": str(s.id),
                "career_track": s.career_track.name,
                "current_day": s.current_day,
                "total_days": s.total_days,
                "xp_earned": s.xp_earned,
                "status": s.status,
            }
            for s in SimulationSession.objects.filter(user=user, status="active")
        ]

        completed_sessions = [
            {
                "id": str(s.id),
                "career_track": s.career_track.name,
                "xp_earned": s.xp_earned,
                "industry_readiness_score": s.industry_readiness_score,
                "completed_at": s.completed_at.isoformat() if s.completed_at else None,
            }
            for s in SimulationSession.objects.filter(user=user, status="completed")
        ]

        user_badges = UserBadge.objects.filter(user=user).select_related("badge")
        badges_data = [
            {
                "slug": ub.badge.slug,
                "name": ub.badge.name,
                "description": ub.badge.description,
                "icon_url": ub.badge.icon_url,
                "awarded_at": ub.awarded_at.isoformat(),
            }
            for ub in user_badges
        ]

        leaderboard_users = (
            User.objects.order_by("-xp_total")[:10]
            .values("id", "name", "xp_total", "career_level", "avatar_url")
        )

        data = DashboardSerializer(
            {
                "xp_total": user.xp_total,
                "career_level": user.career_level,
                "daily_streak": user.daily_streak,
                "active_simulations": list(active_sessions),
                "completed_simulations": list(completed_sessions),
                "badges": badges_data,
                "leaderboard": list(leaderboard_users),
            }
        ).data
        return Response(data, status=status.HTTP_200_OK)


class PassportView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        sessions = SimulationSession.objects.filter(user=user)
        sessions_data = list(
            sessions.values(
                "id", "career_track__name", "status", "xp_earned",
                "industry_readiness_score", "started_at", "completed_at",
            )
        )

        interviews = user.interviews.filter(status="completed")
        interview_data = list(
            interviews.values(
                "id", "interview_type", "overall_score", "communication_score",
                "technical_score", "completed_at",
            )
        )

        user_badges = UserBadge.objects.filter(user=user).select_related("badge")
        badges_data = [
            {
                "slug": ub.badge.slug,
                "name": ub.badge.name,
                "description": ub.badge.description,
                "icon_url": ub.badge.icon_url,
            }
            for ub in user_badges
        ]

        total_xp = user.xp_total
        career_level = user.career_level

        readiness_scores = sessions.filter(
            industry_readiness_score__isnull=False
        ).values_list("industry_readiness_score", flat=True)
        industry_readiness = (
            round(sum(readiness_scores) / len(readiness_scores), 2)
            if readiness_scores
            else 0.0
        )

        data = PassportSerializer(
            {
                "user": UserSerializer(user).data,
                "simulations": sessions_data,
                "interview_scores": interview_data,
                "badges": badges_data,
                "total_xp": total_xp,
                "career_level": career_level,
                "industry_readiness": industry_readiness,
            }
        ).data
        return Response(data, status=status.HTTP_200_OK)
