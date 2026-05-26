import pytest
from app.pipelines.reviewer import evaluate_submission


@pytest.mark.asyncio
async def test_evaluate_submission_returns_dict():
    result = await evaluate_submission(
        task={
            "task_id": "test_001",
            "title": "Test Task",
            "description": "A test task",
            "task_type": "coding",
            "difficulty": "easy",
            "deadline_hours": 4,
        },
        submission_content="print('hello world')",
        submitted_at="2025-01-01T12:00:00",
        task_created_at="2025-01-01T08:00:00",
        deadline_hours=4,
    )
    assert isinstance(result, dict)
    assert "overall_score" in result


@pytest.mark.asyncio
async def test_evaluate_on_time():
    result = await evaluate_submission(
        task={
            "task_id": "test_002",
            "title": "On Time Test",
            "description": "Testing on-time detection",
            "task_type": "coding",
            "difficulty": "easy",
            "deadline_hours": 4,
        },
        submission_content="test content",
        submitted_at="2025-01-01T11:00:00",
        task_created_at="2025-01-01T08:00:00",
        deadline_hours=4,
    )
    assert isinstance(result, dict)
