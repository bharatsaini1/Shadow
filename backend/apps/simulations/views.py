from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CareerTrack, SimulationSession
from .serializers import (
    CareerTrackSerializer,
    SimulationSessionSerializer,
    StartSimulationSerializer,
)


class CareerTrackListView(APIView):
    def get(self, request):
        tracks = CareerTrack.objects.all().order_by("name")
        serializer = CareerTrackSerializer(tracks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
from apps.tasks.models import Task
from services.ai_client import generate_team_message
from celery_tasks.ai_tasks import generate_day_task


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

        session = SimulationSession.objects.create(
            user=request.user, career_track=track, current_day=1, status="active"
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

        task = generate_day_task.delay(str(session.id), str(request.user.id))

        return Response(
            {"task_id": task.id, "status": "queued"},
            status=status.HTTP_202_ACCEPTED,
        )


class TeamMessageView(APIView):
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
            if "error" in result:
                return Response(result, status=status.HTTP_502_BAD_GATEWAY)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": f"Failed to generate team message: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
