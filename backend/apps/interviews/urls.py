from django.urls import path
from .views import StartInterviewView, InterviewMessageView, EndInterviewView, InterviewDetailView

urlpatterns = [
    path("start", StartInterviewView.as_view(), name="interview-start"),
    path("<uuid:interview_id>", InterviewDetailView.as_view(), name="interview-detail"),
    path("<uuid:interview_id>/message", InterviewMessageView.as_view(), name="interview-message"),
    path("<uuid:interview_id>/end", EndInterviewView.as_view(), name="interview-end"),
]
