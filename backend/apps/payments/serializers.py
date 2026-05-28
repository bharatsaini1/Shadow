from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id", "user", "razorpay_order_id", "plan", "amount",
            "currency", "status", "created_at", "completed_at",
        ]
        read_only_fields = ["id", "user", "created_at", "completed_at"]


class SubscribeSerializer(serializers.Serializer):
    plan = serializers.ChoiceField(choices=["pro", "elite"])
