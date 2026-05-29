from django.urls import path
from .views import (
    CareerTrackListView,
    StartSimulationView,
    GetSimulationView,
    GenerateDayView,
    TeamMessageView,
    TeamChatView,
    VacancyListView,
    ApplyJobView,
    MyApplicationsView,
    SimulationReviewView,
    NotificationListView,
    NotificationReadView,
    NotificationReadAllView,
    CertificateListView,
    CertificateDownloadView,
    CheckCertificateView,
)

urlpatterns = [
    path("start", StartSimulationView.as_view(), name="simulation-start"),
    path("career-tracks", CareerTrackListView.as_view(), name="career-track-list"),
    path("vacancies", VacancyListView.as_view(), name="vacancy-list"),
    path("vacancies/apply", ApplyJobView.as_view(), name="vacancy-apply"),
    path("vacancies/applications", MyApplicationsView.as_view(), name="my-applications"),
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
    path(
        "<uuid:session_id>/team-chat",
        TeamChatView.as_view(),
        name="simulation-team-chat",
    ),
    path(
        "<uuid:session_id>/review",
        SimulationReviewView.as_view(),
        name="simulation-review",
    ),
    path(
        "notifications",
        NotificationListView.as_view(),
        name="notification-list",
    ),
    path(
        "notifications/read-all",
        NotificationReadAllView.as_view(),
        name="notification-read-all",
    ),
    path(
        "notifications/<uuid:notification_id>/read",
        NotificationReadView.as_view(),
        name="notification-read",
    ),
    path(
        "certificates",
        CertificateListView.as_view(),
        name="certificate-list",
    ),
    path(
        "certificates/<uuid:certificate_id>/download",
        CertificateDownloadView.as_view(),
        name="certificate-download",
    ),
    path(
        "<uuid:session_id>/certificate",
        CheckCertificateView.as_view(),
        name="certificate-check",
    ),
]
