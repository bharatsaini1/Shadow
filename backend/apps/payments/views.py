import hashlib
import hmac
import json
from datetime import datetime

from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .models import Payment
from .serializers import SubscribeSerializer, PaymentSerializer


class SubscribeView(APIView):
    def post(self, request):
        serializer = SubscribeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        plan = serializer.validated_data["plan"]
        plan_prices = {"pro": 99900, "elite": 249900}
        amount = plan_prices.get(plan)
        if not amount:
            return Response(
                {"error": "Invalid plan"}, status=status.HTTP_400_BAD_REQUEST
            )

        import requests as http_requests

        try:
            auth = (settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            order_data = {
                "amount": amount,
                "currency": "INR",
                "receipt": f"mentriq_{request.user.id}_{datetime.now().timestamp()}",
                "notes": {"user_id": str(request.user.id), "plan": plan},
            }
            resp = http_requests.post(
                "https://api.razorpay.com/v1/orders",
                json=order_data,
                auth=auth,
                timeout=10,
            )
            if resp.status_code != 200:
                return Response(
                    {"error": "Failed to create Razorpay order"},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            razorpay_order = resp.json()

            payment = Payment.objects.create(
                user=request.user,
                razorpay_order_id=razorpay_order["id"],
                plan=plan,
                amount=amount,
                currency="INR",
                status="pending",
            )

            return Response(
                {
                    "order_id": razorpay_order["id"],
                    "amount": razorpay_order["amount"],
                    "currency": razorpay_order["currency"],
                    "key_id": settings.RAZORPAY_KEY_ID,
                    "payment_id": str(payment.id),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            return Response(
                {"error": f"Payment service error: {str(e)}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class WebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        webhook_secret = settings.RAZORPAY_KEY_SECRET
        if not webhook_secret:
            return Response(
                {"error": "Webhook not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        received_signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE", "")
        if not received_signature:
            return Response(
                {"error": "Missing signature"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        expected_signature = hmac.new(
            webhook_secret.encode(),
            request.body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(received_signature, expected_signature):
            return Response(
                {"error": "Invalid signature"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid JSON"}, status=status.HTTP_400_BAD_REQUEST
            )

        event = payload.get("event", "")
        if event == "payment.captured":
            payload_payment = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payload_payment.get("order_id", "")

            try:
                payment = Payment.objects.get(razorpay_order_id=order_id)
                if payment.status == "completed":
                    return Response({"status": "already_processed"}, status=status.HTTP_200_OK)

                payment.status = "completed"
                payment.completed_at = timezone.now()
                payment.save(update_fields=["status", "completed_at"])

                user = payment.user
                user.subscription_plan = payment.plan
                user.save(update_fields=["subscription_plan"])
            except Payment.DoesNotExist:
                pass

        return Response({"status": "received"}, status=status.HTTP_200_OK)
