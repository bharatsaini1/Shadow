import json
from django.utils import timezone
from django.db.models import Avg, Count
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CareerTrack, SimulationSession, JobApplication, Notification, Certificate
from .serializers import (
    CareerTrackSerializer,
    SimulationSessionSerializer,
    StartSimulationSerializer,
    JobApplicationSerializer,
    ApplyJobSerializer,
    CertificateSerializer,
)
from apps.tasks.models import Task, Evaluation
from services.ai_client import generate_simulation_day, generate_team_message, generate_team_chat_response


class CareerTrackListView(APIView):
    def get(self, request):
        domain = request.query_params.get("domain", "")
        difficulty = request.query_params.get("difficulty", "")
        search = request.query_params.get("search", "")

        tracks = CareerTrack.objects.filter(is_active=True)
        if domain:
            tracks = tracks.filter(domain=domain)
        if difficulty:
            tracks = tracks.filter(difficulty_level=difficulty)
        if search:
            tracks = tracks.filter(name__icontains=search)

        tracks = tracks.order_by("name")
        serializer = CareerTrackSerializer(tracks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class StartSimulationView(APIView):
    def post(self, request):
        serializer = StartSimulationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            track = CareerTrack.objects.get(
                id=serializer.validated_data["career_track_id"]
            )
        except CareerTrack.DoesNotExist:
            return Response(
                {"error": "Career track not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        difficulty = serializer.validated_data.get("difficulty", "intermediate")

        session = SimulationSession.objects.create(
            user=request.user,
            career_track=track,
            difficulty=difficulty,
            current_day=1,
            status="active",
        )

        data = SimulationSessionSerializer(session).data
        return Response(data, status=status.HTTP_201_CREATED)


class GetSimulationView(APIView):
    def get(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Simulation session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        tasks = Task.objects.filter(session=session).order_by("created_at")
        tasks_data = [
            {
                "id": str(t.id),
                "title": t.title,
                "description": t.description,
                "task_type": t.task_type,
                "difficulty": t.difficulty,
                "priority": t.priority,
                "deadline_hours": t.deadline_hours,
                "status": t.status,
                "client_context": t.client_context,
                "expected_deliverable": t.expected_deliverable,
                "created_at": t.created_at.isoformat(),
            }
            for t in tasks
        ]

        session_data = SimulationSessionSerializer(session).data
        session_data["tasks"] = tasks_data

        return Response(session_data, status=status.HTTP_200_OK)


class GenerateDayView(APIView):
    def post(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Simulation session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if session.status != "active":
            return Response(
                {"error": "Session is not active"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        previous_tasks = Task.objects.filter(session=session).order_by("created_at")
        previous_context_lines = [
            f"Task {i+1}: {t.title} ({t.status})"
            for i, t in enumerate(previous_tasks)
        ]
        previous_context = (
            "\n".join(previous_context_lines[-5:])
            if previous_context_lines
            else ""
        )

        result = generate_simulation_day(
            role=session.career_track.name,
            day=session.current_day,
            previous_context=previous_context,
            difficulty=session.difficulty,
        )

        if result.get("error"):
            return Response(
                {"error": result["error"], "tasks": [], "manager_message": ""},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        manager_message = result.get("manager_message", "")
        tasks_data = result.get("tasks", [])

        task_objects = []
        for t in tasks_data:
            task = Task.objects.create(
                session=session,
                title=t.get("title", "Untitled Task"),
                description=t.get("description", ""),
                task_type=t.get("task_type", "coding"),
                difficulty=t.get("difficulty", "medium"),
                deadline_hours=t.get("deadline_hours", 4),
                client_context=t.get("client_context", ""),
                expected_deliverable=t.get("expected_deliverable", ""),
                status="pending",
            )
            task_objects.append({
                "id": str(task.id),
                "title": task.title,
                "description": task.description,
                "task_type": task.task_type,
                "difficulty": task.difficulty,
                "priority": task.priority,
                "deadline_hours": task.deadline_hours,
                "status": task.status,
                "client_context": task.client_context,
                "expected_deliverable": task.expected_deliverable,
                "created_at": task.created_at.isoformat(),
            })

        session.current_day += 1
        if session.current_day > session.total_days:
            session.status = "completed"
            session.completed_at = timezone.now()
            avg_score = Evaluation.objects.filter(
                submission__task__session=session
            ).aggregate(avg=Avg("overall_score"))["avg"]
            session.industry_readiness_score = round(avg_score, 2) if avg_score else 0.0

            # Auto-generate certificate if score >= 80
            overall_score = round(avg_score, 2) if avg_score else 0
            if overall_score >= 80:
                cert_type = "project_excellence" if overall_score >= 90 else "high_performance"
                cert_title = {
                    "project_excellence": "Project Excellence Award",
                    "high_performance": "High Performance Achievement",
                    "completion": "Simulation Completion",
                }.get(cert_type, "Certificate of Completion")
                expires_at = timezone.now() + timezone.timedelta(hours=48)
                Certificate.objects.create(
                    user=request.user,
                    session=session,
                    certificate_type=cert_type,
                    title=cert_title,
                    score=int(overall_score),
                    expires_at=expires_at,
                )
                Notification.objects.create(
                    user=request.user,
                    notification_type="certificate_earned",
                    title="Certificate Earned! 🎉",
                    message=f"Congratulations! You earned a certificate with a score of {int(overall_score)}/100.",
                    link=f"/simulation-complete?session_id={session.id}",
                )
        session.save(update_fields=["current_day", "status", "completed_at", "industry_readiness_score"])

        return Response({
            "manager_message": manager_message,
            "tasks": task_objects,
            "current_day": session.current_day,
            "status": session.status,
        }, status=status.HTTP_200_OK)


class TeamMessageView(APIView):
    FALLBACK_MESSAGES = {
        "team_lead": {
            "persona_name": "Priya Sharma",
            "persona_role": "Team Lead",
            "message": "Good morning team! Let's have a productive day. Make sure to review the tasks and reach out if you need any clarification.",
            "message_type": "slack",
        },
        "senior_dev": {
            "persona_name": "Karan Joshi",
            "persona_role": "Senior MERN Developer",
            "message": "Hey! I've reviewed the tasks for today. The coding ones look interesting. Lmk if anyone wants to pair program.",
            "message_type": "slack",
        },
        "client": {
            "persona_name": "Rajiv Nair",
            "persona_role": "Client Representative",
            "message": "Hi Team, just checking in on the progress. Let me know if you need any additional context on the requirements.",
            "message_type": "email",
        },
        "hr": {
            "persona_name": "Sneha Patel",
            "persona_role": "HR Executive",
            "message": "Great work everyone! Keep up the momentum 🚀 Remember to take breaks and stay hydrated!",
            "message_type": "slack",
        },
    }

    def post(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Simulation session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        persona = request.data.get("persona", "team_lead")
        trigger = request.data.get("trigger", "task_submitted")
        context = request.data.get("context", {})
        student_performance = request.data.get("student_performance", "good")
        message_history = request.data.get("message_history", [])

        try:
            result = generate_team_message(
                persona=persona,
                trigger=trigger,
                context=context,
                student_performance=student_performance,
                message_history=message_history,
            )
            if "error" not in result:
                return Response(result, status=status.HTTP_200_OK)
        except Exception:
            pass

        fallback = self.FALLBACK_MESSAGES.get(persona, self.FALLBACK_MESSAGES["team_lead"])
        return Response(fallback, status=status.HTTP_200_OK)


class TeamChatView(APIView):
    FALLBACK_RESPONSE = {
        "team_lead": {
            "persona_name": "Priya Sharma",
            "persona_role": "Team Lead",
            "message": "Hey! I'm a bit swamped right now, but feel free to ask about the tasks.",
            "message_type": "slack",
        },
    }

    def post(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Simulation session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user_message = request.data.get("message", "").strip()
        persona = request.data.get("persona", "team_lead")
        conversation_history = request.data.get("conversation_history", [])

        if not user_message:
            return Response(
                {"error": "Message cannot be empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tasks = Task.objects.filter(session=session).order_by("created_at")
        task_context = "\n".join(
            f"Task {i+1}: {t.title} ({t.status})" for i, t in enumerate(tasks[-5:])
        )

        try:
            result = generate_team_chat_response(
                persona=persona,
                user_message=user_message,
                conversation_history=conversation_history,
                context={
                    "career_track": session.career_track.name,
                    "current_day": session.current_day,
                    "tasks": task_context,
                    "xp_earned": session.xp_earned,
                },
            )
            if "error" not in result:
                return Response(result, status=status.HTTP_200_OK)
        except Exception:
            pass

        fallback = self.FALLBACK_RESPONSE.get(persona, self.FALLBACK_RESPONSE["team_lead"])
        return Response(fallback, status=status.HTTP_200_OK)


class VacancyListView(APIView):
    def get(self, request):
        domain = request.query_params.get("domain", "")
        difficulty = request.query_params.get("difficulty", "")
        search = request.query_params.get("search", "")

        tracks = CareerTrack.objects.filter(is_active=True)
        if domain:
            tracks = tracks.filter(domain=domain)
        if difficulty:
            tracks = tracks.filter(difficulty_level=difficulty)
        if search:
            tracks = tracks.filter(name__icontains=search)

        result = []
        for track in tracks:
            has_applied = JobApplication.objects.filter(
                user=request.user, career_track=track
            ).exists()
            result.append({
                "id": str(track.id),
                "name": track.name,
                "slug": track.slug,
                "description": track.description,
                "company": track.company,
                "domain": track.domain,
                "difficulty_level": track.difficulty_level,
                "requirements": track.requirements,
                "salary_range": track.salary_range,
                "has_applied": has_applied,
            })
        return Response(result, status=status.HTTP_200_OK)


class ApplyJobView(APIView):
    def post(self, request):
        serializer = ApplyJobSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            track = CareerTrack.objects.get(
                id=serializer.validated_data["career_track_id"]
            )
        except CareerTrack.DoesNotExist:
            return Response(
                {"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )

        application, created = JobApplication.objects.get_or_create(
            user=request.user,
            career_track=track,
            defaults={
                "cover_note": serializer.validated_data.get("cover_note", ""),
                "status": "pending",
            },
        )
        if not created:
            return Response(
                {"error": "You have already applied for this position"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = JobApplicationSerializer(application).data
        return Response(data, status=status.HTTP_201_CREATED)


class MyApplicationsView(APIView):
    def get(self, request):
        applications = JobApplication.objects.filter(user=request.user).order_by(
            "-applied_at"
        )
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SimulationReviewView(APIView):
    def get(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Simulation session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        evaluations = (
            Evaluation.objects.filter(submission__task__session=session)
            .select_related("submission__task")
            .order_by("submission__task__created_at")
        )

        if not evaluations:
            return Response(
                {"error": "No evaluations found for this session"},
                status=status.HTTP_404_NOT_FOUND,
            )

        total_scores = {
            "code_quality": [],
            "communication": [],
            "problem_solving": [],
            "time_management": [],
            "completeness": [],
        }
        tasks_data = []
        for ev in evaluations:
            tasks_data.append({
                "title": ev.submission.task.title,
                "task_type": ev.submission.task.task_type,
                "difficulty": ev.submission.task.difficulty,
                "overall_score": ev.overall_score,
                "feedback": ev.feedback[:200] if ev.feedback else "",
                "xp_awarded": ev.xp_awarded,
                "evaluated_at": ev.evaluated_at.isoformat(),
            })
            if ev.code_quality_score is not None:
                total_scores["code_quality"].append(ev.code_quality_score)
            if ev.communication_score is not None:
                total_scores["communication"].append(ev.communication_score)
            if ev.problem_solving_score is not None:
                total_scores["problem_solving"].append(ev.problem_solving_score)
            if ev.time_management_score is not None:
                total_scores["time_management"].append(ev.time_management_score)
            if ev.completeness_score is not None:
                total_scores["completeness"].append(ev.completeness_score)

        avg_scores = {}
        for key, vals in total_scores.items():
            avg_scores[key] = round(sum(vals) / len(vals), 1) if vals else 0

        all_scores = [e.overall_score for e in evaluations]
        avg_overall = round(sum(all_scores) / len(all_scores), 1) if all_scores else 0

        strengths = []
        improvements = []
        for ev in evaluations:
            if ev.strengths:
                strengths.extend(ev.strengths)
            if ev.improvement_suggestions:
                improvements.extend(ev.improvement_suggestions)

        return Response({
            "session_id": str(session.id),
            "career_track": session.career_track.name,
            "difficulty": session.difficulty,
            "total_days": session.total_days,
            "xp_earned": session.xp_earned,
            "industry_readiness_score": session.industry_readiness_score,
            "status": session.status,
            "completed_at": session.completed_at.isoformat() if session.completed_at else None,
            "tasks_completed": len(tasks_data),
            "overall_average_score": avg_overall,
            "dimension_averages": avg_scores,
            "tasks": tasks_data,
            "strengths": list(set(strengths))[:5],
            "improvements": list(set(improvements))[:5],
        }, status=status.HTTP_200_OK)


class NotificationListView(APIView):
    def get(self, request):
        unread_first = request.query_params.get("unread_first", "true") == "true"
        limit = int(request.query_params.get("limit", 20))

        qs = Notification.objects.filter(user=request.user)
        if unread_first:
            qs = qs.order_by("-is_read", "-created_at")
        else:
            qs = qs.order_by("-created_at")

        notifications = qs[:limit]
        unread_count = Notification.objects.filter(
            user=request.user, is_read=False
        ).count()

        data = [
            {
                "id": str(n.id),
                "notification_type": n.notification_type,
                "title": n.title,
                "message": n.message,
                "link": n.link,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat(),
            }
            for n in notifications
        ]

        return Response({
            "notifications": data,
            "unread_count": unread_count,
        }, status=status.HTTP_200_OK)


class NotificationReadView(APIView):
    def post(self, request, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id, user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response({"status": "read"}, status=status.HTTP_200_OK)


class NotificationReadAllView(APIView):
    def post(self, request):
        Notification.objects.filter(
            user=request.user, is_read=False
        ).update(is_read=True)
        return Response({"status": "all_read"}, status=status.HTTP_200_OK)


class CertificateListView(APIView):
    def get(self, request):
        certs = Certificate.objects.filter(user=request.user)
        serializer = CertificateSerializer(certs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CertificateDownloadView(APIView):
    def get(self, request, certificate_id):
        try:
            cert = Certificate.objects.get(id=certificate_id, user=request.user)
        except Certificate.DoesNotExist:
            return Response(
                {"error": "Certificate not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if cert.file_url:
            from urllib.parse import urlparse
            file_path = cert.file_url
            if file_path.startswith("/media/"):
                file_path = file_path[7:]
            from django.conf import settings
            full_path = settings.MEDIA_ROOT / file_path
            if full_path.exists():
                with open(full_path, "rb") as f:
                    content = f.read()
                response = HttpResponse(content, content_type="application/pdf")
                response["Content-Disposition"] = f'attachment; filename="certificate_{cert.id}.pdf"'
                return response

        return self._generate_and_serve(cert)

    def _generate_and_serve(self, cert):
        from io import BytesIO
        from reportlab.lib.pagesizes import A4, landscape
        from reportlab.lib.units import mm
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.colors import HexColor
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib import colors
        from django.conf import settings

        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, pagesize=landscape(A4),
            rightMargin=30*mm, leftMargin=30*mm,
            topMargin=20*mm, bottomMargin=20*mm,
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "CertTitle", parent=styles["Title"],
            fontSize=36, leading=42,
            textColor=HexColor("#1a1a2e"),
            spaceAfter=20, spaceBefore=10,
            fontName="Helvetica-Bold",
        )
        body_style = ParagraphStyle(
            "CertBody", parent=styles["Normal"],
            fontSize=14, leading=20,
            textColor=HexColor("#333333"),
            alignment=1, spaceAfter=12,
        )
        name_style = ParagraphStyle(
            "CertName", parent=title_style,
            fontSize=28, leading=34,
            textColor=HexColor("#2563EB"),
            spaceAfter=16,
        )

        elements = []
        elements.append(Paragraph("MENTRIQ SHADOW", ParagraphStyle(
            "Header", fontSize=14, textColor=HexColor("#2563EB"),
            alignment=1, spaceAfter=30, fontName="Helvetica-Bold",
        )))
        elements.append(Paragraph("Certificate of Achievement", title_style))
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("This is to certify that", body_style))

        user_name = cert.user.name or cert.user.email
        elements.append(Paragraph(user_name, name_style))

        elements.append(Paragraph(
            f"has successfully completed the simulation and demonstrated excellence"
            f" with an overall score of <b>{cert.score}/100</b>.",
            body_style,
        ))
        elements.append(Spacer(1, 15))
        elements.append(Paragraph(
            f"Simulation: {cert.session.career_track.name} &nbsp;|&nbsp; "
            f"Difficulty: {cert.session.difficulty.capitalize()} &nbsp;|&nbsp; "
            f"Days: {cert.session.total_days}",
            body_style,
        ))
        elements.append(Spacer(1, 30))
        elements.append(Paragraph(
            f"Issued: {cert.created_at.strftime('%B %d, %Y')}",
            ParagraphStyle("Date", parent=body_style, fontSize=11, textColor=HexColor("#666666")),
        ))
        elements.append(Paragraph(
            f"Expires: {cert.expires_at.strftime('%B %d, %Y')}" if cert.expires_at else "",
            ParagraphStyle("Expiry", parent=body_style, fontSize=11, textColor=HexColor("#999999")),
        ))

        doc.build(elements)
        buffer.seek(0)

        filename = f"certificates/{cert.id}.pdf"
        fs_path = settings.MEDIA_ROOT / filename
        fs_path.parent.mkdir(parents=True, exist_ok=True)
        with open(fs_path, "wb") as f:
            f.write(buffer.getvalue())

        cert.file_url = f"{settings.MEDIA_URL}{filename}"
        cert.save(update_fields=["file_url"])

        response = HttpResponse(buffer.getvalue(), content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="certificate_{cert.id}.pdf"'
        return response


class CheckCertificateView(APIView):
    def get(self, request, session_id):
        try:
            session = SimulationSession.objects.get(
                id=session_id, user=request.user
            )
        except SimulationSession.DoesNotExist:
            return Response(
                {"error": "Session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        cert = Certificate.objects.filter(session=session, user=request.user).first()
        if cert:
            return Response({
                "has_certificate": True,
                "certificate": CertificateSerializer(cert).data,
            })
        return Response({"has_certificate": False, "certificate": None})
