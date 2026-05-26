# MentriQ AI Service

Internal AI microservice that exposes 5 notebook-based pipelines as HTTP endpoints.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/ai/simulate/generate-day` | Generate a simulation work day |
| POST | `/ai/evaluate/submission` | Evaluate a student submission |
| POST | `/ai/interview/turn` | Process one interview turn |
| POST | `/ai/interview/score` | Generate interview scores |
| POST | `/ai/persona/message` | Generate a persona message |

## Auth

All endpoints except `/health` require `X-API-Key` header matching `AI_SERVICE_API_KEY`.

## Running

```bash
cp .env.example .env  # fill in your API keys
uvicorn app.main:app --reload --port 8000
```

## Testing

```bash
pytest tests/ -v
```
