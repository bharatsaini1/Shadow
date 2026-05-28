from django.urls import path
from .views import RegisterView, LoginView, DashboardView, PassportView

urlpatterns = [
    path("register", RegisterView.as_view(), name="auth-register"),
    path("login", LoginView.as_view(), name="auth-login"),
    path("<uuid:user_id>/dashboard", DashboardView.as_view(), name="user-dashboard"),
    path("<uuid:user_id>/passport", PassportView.as_view(), name="user-passport"),
]
