from django.urls import path
from .views import (
    CareerTrackListView,
    StartSimulationView,
    GetSimulationView,
    GenerateDayView,
    TeamMessageView,
)

urlpatterns = [
    path("start", StartSimulationView.as_view(), name="simulation-start"),
    path("career-tracks", CareerTrackListView.as_view(), name="career-track-list"),
    path("<uuid:session_id>", GetSimulationView.as_view(), name="simulation-detail"),
    path(
        "<uuid:session_id>/generate-day",
        GenerateDayView.as_view(),
        name="simulation-generate-day",
    ),
    path(
        "<uuid:session_id>/team-message",
        TeamMessageView.as_view(),
        name="simulation-team-message",
    ),
]
