from django.contrib import admin
from .models import CareerTrack, SimulationSession


@admin.register(CareerTrack)
class CareerTrackAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "difficulty_level"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(SimulationSession)
class SimulationSessionAdmin(admin.ModelAdmin):
    list_display = ["user", "career_track", "status", "current_day", "xp_earned", "started_at"]
    list_filter = ["status", "career_track"]
    search_fields = ["user__email", "user__name"]
