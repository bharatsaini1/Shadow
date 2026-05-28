from django.urls import path
from .views import SubscribeView, WebhookView

urlpatterns = [
    path("subscribe", SubscribeView.as_view(), name="payment-subscribe"),
    path("webhook", WebhookView.as_view(), name="payment-webhook"),
]
