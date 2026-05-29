from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import simulation, evaluation, interview, persona

app = FastAPI(
    title="MentriQ AI Service",
    description="Internal AI pipeline API. Not for public use.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation.router, prefix="/ai/simulate", tags=["Simulation Engine"])
app.include_router(evaluation.router, prefix="/ai/evaluate", tags=["AI Reviewer"])
app.include_router(interview.router, prefix="/ai/interview", tags=["Interview Agent"])
app.include_router(persona.router, prefix="/ai/persona", tags=["Team Persona"])


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "mentriq-ai"}
