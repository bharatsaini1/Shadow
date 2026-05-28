from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "name", "subscription_plan", "xp_total", "career_level", "is_active"]
    list_filter = ["subscription_plan", "is_active"]
    search_fields = ["email", "name"]
