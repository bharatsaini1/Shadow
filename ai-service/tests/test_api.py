import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.config import get_settings
from unittest.mock import patch

API_KEY = get_settings().ai_service_api_key


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_health_no_auth_required(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok", "service": "mentriq-ai"}


@pytest.mark.asyncio
async def test_auth_missing_key(client):
    response = await client.post("/ai/simulate/generate-day", json={})
    assert response.status_code == 401
    assert "Invalid or missing API key" in response.json()["detail"]


@pytest.mark.asyncio
async def test_auth_wrong_key(client):
    response = await client.post(
        "/ai/simulate/generate-day",
        json={},
        headers={"X-API-Key": "wrong-key"},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_auth_correct_key(client):
    response = await client.post(
        "/ai/simulate/generate-day",
        json={},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code != 401


@pytest.mark.asyncio
async def test_simulation_validation_missing_fields(client):
    response = await client.post(
        "/ai/simulate/generate-day",
        json={},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422
    errors = {e["loc"][-1]: e["msg"] for e in response.json()["detail"]}
    assert "role" in errors
    assert "day" in errors


@pytest.mark.asyncio
async def test_simulation_validation_invalid_day(client):
    response = await client.post(
        "/ai/simulate/generate-day",
        json={"role": "MERN Stack Developer", "day": 99},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_simulation_validation_invalid_difficulty(client):
    response = await client.post(
        "/ai/simulate/generate-day",
        json={"role": "MERN Stack Developer", "day": 1, "difficulty": "extreme"},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_evaluation_validation_missing_fields(client):
    response = await client.post(
        "/ai/evaluate/submission",
        json={},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
@patch("app.routers.interview.run_turn")
async def test_interview_turn_invalid_type(mock_run_turn, client):
    response = await client.post(
        "/ai/interview/turn",
        json={
            "user_message": "Hello",
            "interview_type": "invalid",
            "role": "dev",
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
@patch("app.routers.interview.run_turn")
async def test_interview_turn_success(mock_run_turn, client):
    mock_run_turn.return_value = {
        "ai_response": "Hello! Ready for the interview.",
        "is_complete": False,
        "next_action": "continue",
        "turn_count": 1,
    }
    response = await client.post(
        "/ai/interview/turn",
        json={
            "user_message": "Hello, I'm ready.",
            "conversation_history": [],
            "interview_type": "technical",
            "role": "MERN Stack Developer",
            "simulation_context": "",
            "turn_count": 0,
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["ai_response"] == "Hello! Ready for the interview."
    assert data["is_complete"] is False


@pytest.mark.asyncio
@patch("app.routers.interview.generate_scores")
async def test_interview_score_success(mock_gen_scores, client):
    mock_gen_scores.return_value = {
        "scores": {"technical_knowledge": 8, "communication": 7, "confidence": 6, "problem_solving": 8, "cultural_fit": 7},
        "overall_score": 72,
        "feedback": "Good performance.",
        "interview_summary": "Candidate did well.",
        "strengths": ["Technical knowledge"],
        "areas_for_improvement": ["Confidence"],
    }
    response = await client.post(
        "/ai/interview/score",
        json={
            "transcript": [
                {"role": "assistant", "content": "Welcome."},
                {"role": "user", "content": "Thanks."},
            ],
            "interview_type": "technical",
            "role": "MERN Stack Developer",
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_score"] == 72
    assert data["scores"]["technical_knowledge"] == 8


@pytest.mark.asyncio
@patch("app.routers.persona.generate_message")
async def test_persona_message_success(mock_gen_message, client):
    mock_gen_message.return_value = {
        "persona_name": "Alice (Team Lead)",
        "persona_role": "Team Lead",
        "message": "Great work on the landing page!",
        "message_type": "slack",
        "timestamp_offset_minutes": 30,
    }
    response = await client.post(
        "/ai/persona/message",
        json={
            "persona": "team_lead",
            "trigger": "task_submitted",
            "context": {"task_title": "Build landing page"},
            "student_performance": "excellent",
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["persona_name"] == "Alice (Team Lead)"
    assert data["message_type"] == "slack"


@pytest.mark.asyncio
async def test_persona_validation_invalid_persona(client):
    response = await client.post(
        "/ai/persona/message",
        json={"persona": "invalid_persona"},
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_evaluation_validation_missing_task(client):
    response = await client.post(
        "/ai/evaluate/submission",
        json={
            "submission_content": "code here",
            "submitted_at": "2025-01-01T10:00:00",
            "task_created_at": "2025-01-01T08:00:00",
            "deadline_hours": 8,
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
@patch("app.routers.simulation.generate_day")
async def test_simulation_success(mock_generate_day, client):
    mock_generate_day.return_value = {
        "manager_message": "Welcome to day 1!",
        "tasks": [
            {
                "task_id": "task_1",
                "title": "Setup Project",
                "description": "Initialize the project",
                "task_type": "setup",
                "difficulty": "easy",
                "deadline_hours": 4,
                "client_context": "",
                "expected_deliverable": "Repo initialized",
            }
        ],
    }
    response = await client.post(
        "/ai/simulate/generate-day",
        json={
            "role": "MERN Stack Developer",
            "day": 1,
            "previous_context": "",
            "difficulty": "easy",
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["manager_message"] == "Welcome to day 1!"
    assert len(data["tasks"]) == 1


@pytest.mark.asyncio
@patch("app.routers.evaluation.evaluate_submission")
async def test_evaluation_success(mock_evaluate, client):
    mock_evaluate.return_value = {
        "overall_score": 85,
        "scores": {"code_quality": 8, "communication": 7, "problem_solving": 9, "time_management": 8, "completeness": 9},
        "xp_earned": 100,
        "feedback": "Great submission!",
        "strengths": ["Clean code"],
        "improvement_suggestions": ["Add more tests"],
        "what_a_senior_would_say": "Good work overall.",
    }
    response = await client.post(
        "/ai/evaluate/submission",
        json={
            "task": {
                "task_id": "task_1",
                "title": "Build API",
                "description": "Build a REST API",
                "task_type": "coding",
                "difficulty": "medium",
                "deadline_hours": 8,
            },
            "submission_content": "def hello(): pass",
            "submitted_at": "2025-01-01T10:00:00",
            "task_created_at": "2025-01-01T08:00:00",
            "deadline_hours": 8,
        },
        headers={"X-API-Key": API_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["overall_score"] == 85
    assert data["xp_earned"] == 100
