from fastapi import APIRouter, Depends
from app.auth import verify_api_key
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.pipelines.simulation_engine import generate_day

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post("/generate-day", response_model=SimulationResponse)
async def generate_simulation_day(body: SimulationRequest):
    result = await generate_day(
        role=body.role,
        day=body.day,
        previous_context=body.previous_context,
        difficulty=body.difficulty,
    )
    return result
