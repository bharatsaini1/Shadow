from rest_framework import serializers
from .models import Task, Submission, Evaluation, Badge, UserBadge


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id", "session", "title", "description", "task_type", "difficulty",
            "deadline_hours", "status", "client_context", "expected_deliverable",
            "created_at",
        ]
        read_only_fields = ["id", "session", "created_at"]


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["id", "task", "user", "content", "file_urls", "submitted_at"]
        read_only_fields = ["id", "user", "submitted_at"]


class SubmitTaskSerializer(serializers.Serializer):
    content = serializers.CharField(required=False, allow_blank=True)
    file_urls = serializers.ListField(
        child=serializers.URLField(), required=False, default=list
    )


class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = [
            "id", "submission", "overall_score", "code_quality_score",
            "communication_score", "problem_solving_score",
            "time_management_score", "completeness_score", "feedback",
            "strengths", "improvement_suggestions", "what_a_senior_would_say",
            "xp_awarded", "evaluated_at",
        ]


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ["slug", "name", "description", "icon_url"]


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ["id", "badge", "awarded_at"]
