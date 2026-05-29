import requests
from django.conf import settings


def _headers():
    return {
        "Content-Type": "application/json",
        "X-API-Key": settings.AI_SERVICE_API_KEY,
    }


def _post(endpoint: str, payload: dict) -> dict:
    url = f"{settings.AI_SERVICE_URL.rstrip('/')}{endpoint}"
    try:
        resp = requests.post(url, json=payload, headers=_headers(), timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.ConnectionError:
        return {"error": "Cannot connect to AI service"}
    except requests.exceptions.Timeout:
        return {"error": "AI service request timed out"}
    except requests.exceptions.HTTPError as e:
        return {"error": f"AI service HTTP error: {e}"}
    except requests.exceptions.RequestException as e:
        return {"error": f"AI service request failed: {str(e)}"}


def generate_simulation_day(
    role: str, day: int, previous_context: str, difficulty: str
) -> dict:
    difficulty_map = {
        "beginner": "easy",
        "easy": "easy",
        "intermediate": "intermediate",
        "hard": "hard",
        "advanced": "hard",
    }
    normalized = difficulty_map.get(difficulty.lower(), "intermediate")
    return _post("/ai/simulate/generate-day", {
        "role": role,
        "day": day,
        "previous_context": previous_context,
        "difficulty": normalized,
    })


def evaluate_submission(
    task: dict,
    submission_content: str,
    submitted_at: str,
    task_created_at: str,
    deadline_hours: int,
) -> dict:
    return _post("/ai/evaluate/submission", {
        "task": task,
        "submission_content": submission_content,
        "submitted_at": submitted_at,
        "task_created_at": task_created_at,
        "deadline_hours": deadline_hours,
    })


def process_interview_turn(
    user_message: str,
    conversation_history: list,
    interview_type: str,
    role: str,
    simulation_context: str = "",
    turn_count: int = 0,
) -> dict:
    return _post("/ai/interview/turn", {
        "user_message": user_message,
        "conversation_history": conversation_history,
        "interview_type": interview_type,
        "role": role,
        "simulation_context": simulation_context,
        "turn_count": turn_count,
    })


def generate_interview_scores(
    transcript: list,
    interview_type: str,
    role: str,
) -> dict:
    return _post("/ai/interview/score", {
        "transcript": transcript,
        "interview_type": interview_type,
        "role": role,
    })


def generate_team_message(
    persona: str,
    trigger: str,
    context: dict,
    student_performance: str,
    message_history: list,
) -> dict:
    return _post("/ai/persona/message", {
        "persona": persona,
        "trigger": trigger,
        "context": context,
        "student_performance": student_performance,
        "message_history": message_history,
    })


def generate_team_chat_response(
    persona: str,
    user_message: str,
    conversation_history: list,
    context: dict,
) -> dict:
    return _post("/ai/persona/chat", {
        "persona": persona,
        "user_message": user_message,
        "conversation_history": conversation_history,
        "context": context,
    })
