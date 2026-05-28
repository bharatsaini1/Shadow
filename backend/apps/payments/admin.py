from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["user", "plan", "amount", "currency", "status", "created_at"]
    list_filter = ["plan", "status"]
    search_fields = ["user__email", "razorpay_order_id"]
