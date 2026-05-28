from django.contrib import admin
from .models import Task, Submission, Evaluation, Badge, UserBadge


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["title", "session", "task_type", "difficulty", "status", "created_at"]
    list_filter = ["task_type", "difficulty", "status"]
    search_fields = ["title", "description"]


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["task", "user", "submitted_at"]


@admin.register(Evaluation)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ["submission", "overall_score", "xp_awarded", "evaluated_at"]


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ["slug", "name"]


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ["user", "badge", "awarded_at"]
