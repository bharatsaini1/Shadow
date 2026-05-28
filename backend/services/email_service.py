import requests
from django.conf import settings


def send_email(to: str, subject: str, html_body: str) -> dict:
    api_key = settings.RESEND_API_KEY
    if not api_key:
        return {"error": "Resend API key not configured"}

    try:
        resp = requests.post(
            "https://api.resend.com/emails",
            json={
                "from": "MentriQ <noreply@mentriq.com>",
                "to": [to],
                "subject": subject,
                "html": html_body,
            },
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to send email: {str(e)}"}
