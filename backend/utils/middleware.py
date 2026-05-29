import time
from django.core.cache import cache
from django.http import JsonResponse
from django.middleware.csrf import get_token


class EnsureCsrfCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            get_token(request)
        return response


class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/"):
            ip = self.get_client_ip(request)
            path_key = f"ratelimit:{request.method}:{request.path}:{ip}"
            count = cache.get(path_key, 0)

            if request.method in ("POST", "PUT", "DELETE"):
                limit = 30
            else:
                limit = 100

            if count >= limit:
                return JsonResponse(
                    {"error": "Rate limit exceeded. Please try again later."},
                    status=429,
                )

            cache.set(path_key, count + 1, 60)

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        if not getattr(request, '_trusted_proxy', False):
            return request.META.get("REMOTE_ADDR", "0.0.0.0")
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "0.0.0.0")
