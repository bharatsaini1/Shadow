from django.contrib import admin
from .models import InterviewSession


@admin.register(InterviewSession)
class InterviewSessionAdmin(admin.ModelAdmin):
    list_display = [
        "user", "interview_type", "status", "overall_score", "started_at"
    ]
    list_filter = ["interview_type", "status"]
    search_fields = ["user__email", "user__name"]
