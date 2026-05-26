import pytest
from app.pipelines.interview_agent import run_turn, generate_scores


@pytest.mark.asyncio
async def test_run_turn_returns_dict():
    result = await run_turn(
        user_message="Hello, I'm ready for the interview.",
        conversation_history=[],
        interview_type="technical",
        role="MERN Stack Developer",
        simulation_context="",
        turn_count=0,
    )
    assert isinstance(result, dict)
    assert "ai_response" in result
    assert "is_complete" in result
    assert "next_action" in result


@pytest.mark.asyncio
async def test_generate_scores_returns_dict():
    result = await generate_scores(
        transcript=[
            {"role": "assistant", "content": "Welcome to the interview."},
            {"role": "user", "content": "Thank you, happy to be here."},
        ],
        interview_type="technical",
        role="MERN Stack Developer",
    )
    assert isinstance(result, dict)
    assert "overall_score" in result
