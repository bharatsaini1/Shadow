import pytest
from app.pipelines.simulation_engine import generate_day


@pytest.mark.asyncio
async def test_generate_day_returns_dict():
    result = await generate_day(
        role="MERN Stack Developer",
        day=1,
        previous_context="",
        difficulty="easy",
    )
    assert isinstance(result, dict)
    assert "manager_message" in result
    assert "tasks" in result


@pytest.mark.asyncio
async def test_generate_day_error_handling():
    result = await generate_day(
        role="",
        day=99,
        previous_context="",
        difficulty="invalid",
    )
    assert "error" in result or "manager_message" in result
