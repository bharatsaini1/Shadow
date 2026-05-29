from rest_framework import serializers
from .models import InterviewSession


class InterviewSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewSession
        fields = [
            "id", "user", "simulation_session", "role", "interview_type", "status",
            "transcript", "technical_score", "communication_score",
            "confidence_score", "problem_solving_score", "cultural_fit_score",
            "overall_score", "feedback", "interview_summary", "strengths",
            "areas_for_improvement", "started_at", "completed_at",
        ]
        read_only_fields = [
            "id", "user", "role", "status", "transcript", "technical_score",
            "communication_score", "confidence_score", "problem_solving_score",
            "cultural_fit_score", "overall_score", "feedback", "interview_summary",
            "strengths", "areas_for_improvement", "started_at", "completed_at",
        ]


class StartInterviewSerializer(serializers.Serializer):
    interview_type = serializers.ChoiceField(
        choices=["technical", "hr", "behavioral"]
    )
    simulation_session_id = serializers.UUIDField(required=False, allow_null=True)
    role = serializers.CharField(required=False, allow_blank=True)


class InterviewMessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class InterviewMessageResponseSerializer(serializers.Serializer):
    ai_response = serializers.CharField()
    is_complete = serializers.BooleanField()
    next_action = serializers.CharField()
    turn_count = serializers.IntegerField()
