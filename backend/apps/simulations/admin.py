from django.contrib import admin
from .models import CareerTrack, SimulationSession, Notification, Certificate


@admin.register(CareerTrack)
class CareerTrackAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "difficulty_level"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(SimulationSession)
class SimulationSessionAdmin(admin.ModelAdmin):
    list_display = ["user", "career_track", "status", "current_day", "xp_earned", "started_at"]
    list_filter = ["status", "career_track"]
    search_fields = ["user__email", "user__name"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "notification_type", "title", "is_read", "created_at"]
    list_filter = ["notification_type", "is_read"]
    search_fields = ["user__email", "title"]


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["user", "title", "score", "certificate_type", "created_at", "expires_at"]
    list_filter = ["certificate_type", "created_at"]
    search_fields = ["user__email", "title"]
