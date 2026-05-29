from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import InterviewSession
from .serializers import (
    InterviewSessionSerializer,
    StartInterviewSerializer,
    InterviewMessageSerializer,
)
from apps.simulations.models import SimulationSession
from services.ai_client import process_interview_turn, generate_interview_scores


class InterviewDetailView(APIView):
    def get(self, request, interview_id):
        try:
            interview = InterviewSession.objects.get(
                id=interview_id, user=request.user
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        data = InterviewSessionSerializer(interview).data
        return Response(data, status=status.HTTP_200_OK)


class StartInterviewView(APIView):
    def post(self, request):
        serializer = StartInterviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        simulation_session = None
        session_id = serializer.validated_data.get("simulation_session_id")
        if session_id:
            try:
                simulation_session = SimulationSession.objects.get(
                    id=session_id, user=request.user
                )
            except SimulationSession.DoesNotExist:
                return Response(
                    {"error": "Simulation session not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        role = serializer.validated_data.get("role", "") or "Software Engineer"
        if simulation_session:
            role = simulation_session.career_track.name

        interview = InterviewSession.objects.create(
            user=request.user,
            simulation_session=simulation_session,
            role=role,
            interview_type=serializer.validated_data["interview_type"],
            status="active",
            transcript=[],
        )

        data = InterviewSessionSerializer(interview).data
        return Response(data, status=status.HTTP_201_CREATED)


class InterviewMessageView(APIView):
    def post(self, request, interview_id):
        try:
            interview = InterviewSession.objects.get(
                id=interview_id, user=request.user, status="active"
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Active interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = InterviewMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_message = serializer.validated_data["message"]
        turn_count = len(interview.transcript) // 2

        simulation_context = ""
        if interview.simulation_session:
            session = interview.simulation_session
            simulation_context = (
                f"Career track: {session.career_track.name}, "
                f"Day {session.current_day} of {session.total_days}"
            )

        try:
            result = process_interview_turn(
                user_message=user_message,
                conversation_history=interview.transcript,
                interview_type=interview.interview_type,
                role=interview.role,
                simulation_context=simulation_context,
                turn_count=turn_count,
            )
        except Exception as e:
            return Response(
                {"error": f"AI service error: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        interview.transcript.append(
            {"role": "user", "content": user_message}
        )
        interview.transcript.append(
            {"role": "assistant", "content": result["ai_response"]}
        )
        interview.save(update_fields=["transcript"])

        if result.get("is_complete"):
            interview.status = "completed"
            interview.completed_at = timezone.now()
            interview.save(update_fields=["status", "completed_at"])

            try:
                scores_result = generate_interview_scores(
                    transcript=interview.transcript,
                    interview_type=interview.interview_type,
                    role=interview.role,
                )
                sc = scores_result.get("scores", {})
                interview.technical_score = sc.get("technical_knowledge")
                interview.communication_score = sc.get("communication")
                interview.confidence_score = sc.get("confidence")
                interview.problem_solving_score = sc.get("problem_solving")
                interview.cultural_fit_score = sc.get("cultural_fit")
                interview.overall_score = scores_result.get("overall_score")
                interview.feedback = scores_result.get("feedback", "")
                interview.interview_summary = scores_result.get("interview_summary", "")
                interview.strengths = scores_result.get("strengths", [])
                interview.areas_for_improvement = scores_result.get("areas_for_improvement", [])
                interview.save()
            except Exception:
                pass

            data = InterviewSessionSerializer(interview).data
            data["is_complete"] = True
            data["ai_response"] = result.get("ai_response", "")
            return Response(data, status=status.HTTP_200_OK)

        return Response(result, status=status.HTTP_200_OK)


class EndInterviewView(APIView):
    def post(self, request, interview_id):
        try:
            interview = InterviewSession.objects.get(
                id=interview_id, user=request.user, status="active"
            )
        except InterviewSession.DoesNotExist:
            return Response(
                {"error": "Active interview session not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            scores = generate_interview_scores(
                transcript=interview.transcript,
                interview_type=interview.interview_type,
                role=interview.role,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to generate scores: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        sc = scores.get("scores", {})
        interview.technical_score = sc.get("technical_knowledge")
        interview.communication_score = sc.get("communication")
        interview.confidence_score = sc.get("confidence")
        interview.problem_solving_score = sc.get("problem_solving")
        interview.cultural_fit_score = sc.get("cultural_fit")
        interview.overall_score = scores.get("overall_score")
        interview.feedback = scores.get("feedback", "")
        interview.interview_summary = scores.get("interview_summary", "")
        interview.strengths = scores.get("strengths", [])
        interview.areas_for_improvement = scores.get("areas_for_improvement", [])
        interview.status = "completed"
        interview.completed_at = timezone.now()
        interview.save()

        data = InterviewSessionSerializer(interview).data
        data["is_complete"] = True
        return Response(data, status=status.HTTP_200_OK)
