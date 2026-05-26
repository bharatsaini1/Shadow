import pytest
from app.pipelines.team_persona import generate_message


@pytest.mark.asyncio
async def test_generate_message_returns_dict():
    result = await generate_message(
        persona="team_lead",
        trigger="task_submitted",
        context={"task_title": "Fix auth bug"},
        student_performance="good",
    )
    assert isinstance(result, dict)
    assert "persona_name" in result
    assert "message" in result


@pytest.mark.asyncio
async def test_generate_message_unknown_persona():
    result = await generate_message(
        persona="unknown_persona",
    )
    assert "error" in result


@pytest.mark.asyncio
async def test_all_personas_return_valid():
    for persona in ["team_lead", "senior_dev", "client", "hr"]:
        result = await generate_message(
            persona=persona,
            trigger="task_submitted",
            context={"task_title": "Build landing page"},
            student_performance="excellent",
        )
        assert "persona_name" in result
        assert "message" in result
        assert "message_type" in result
