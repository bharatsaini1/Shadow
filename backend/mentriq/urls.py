from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/v1/auth/", include("apps.users.urls")),
    path("api/v1/simulations/", include("apps.simulations.urls")),
    path("api/v1/tasks/", include("apps.tasks.urls")),
    path("api/v1/interviews/", include("apps.interviews.urls")),
    path("api/v1/payments/", include("apps.payments.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
