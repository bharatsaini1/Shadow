# MentriQ Shadow 🧠

> **"Experience the Job Before Getting the Job."**

An AI-powered career simulation platform where students work in a virtual company environment — completing real tasks, getting AI-reviewed feedback, practicing interviews, and collaborating with AI teammates — before ever applying for a job.

---

## Table of Contents

- [What We Are Building](#what-we-are-building)
- [Project Status](#project-status)
- [Repository Structure](#repository-structure)
- [Phase 1 — AI Pipelines (Jupyter Notebooks)](#phase-1--ai-pipelines-jupyter-notebooks)
- [Phase 2 — Backend (Django)](#phase-2--backend-django)
- [Phase 3 — Frontend (Next.js + Tailwind CSS)](#phase-3--frontend-nextjs--tailwind-css)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Data Flow](#data-flow)
- [Database Schema Overview](#database-schema-overview)
- [API Endpoints Overview](#api-endpoints-overview)
- [Career Tracks](#career-tracks)
- [Gamification System](#gamification-system)
- [Monetization](#monetization)
- [Running the Project Locally](#running-the-project-locally)

---

## What We Are Building

MentriQ Shadow solves one critical problem: **students graduate with theory but zero real-world experience**. Companies want experienced freshers. Freshers can't get experience without a job. This is the chicken-and-egg trap.

**MentriQ Shadow breaks this loop** by simulating a full work environment powered by AI:

| Traditional EdTech | MentriQ Shadow |
|---|---|
| Watch video → take quiz | Work a real task → get AI reviewed |
| Passive learning | Active simulation |
| Certificate of completion | Verifiable performance report (Shadow Passport) |
| Generic content | Role-specific AI simulation |
| No team interaction | AI teammates, manager, client |

The platform is built in **3 phases**:

- **Phase 1** — Build and test all AI pipelines as Jupyter Notebooks
- **Phase 2** — Convert notebooks into a Django + Django REST Framework backend with full AI service integration
- **Phase 3** — Build the frontend using **Next.js 14 (App Router) + Tailwind CSS**

---

## Project Status

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Jupyter Notebook AI Pipelines | 🔄 In Progress |
| Phase 2 | Django Backend + SQLite (local) | ⏳ Not Started |
| Phase 3 | Next.js + Tailwind CSS Frontend | ⏳ Not Started |

---

## Repository Structure

```
mentriq-shadow/
│
├── notebooks/                        ← PHASE 1: All AI pipelines (start here)
│   ├── 01_simulation_engine.ipynb
│   ├── 02_ai_reviewer.ipynb
│   ├── 03_interview_agent.ipynb
│   ├── 04_team_persona_engine.ipynb
│   ├── 05_rag_knowledge_base.ipynb
│   ├── requirements.txt
│   └── data/
│       ├── career_knowledge/
│       │   ├── mern_developer.json
│       │   ├── ui_ux_designer.json
│       │   └── data_analyst.json
│       ├── task_templates/
│       │   ├── mern_tasks.json
│       │   └── hr_tasks.json
│       └── evaluation_rubrics/
│           ├── code_review_rubric.json
│           ├── communication_rubric.json
│           └── design_rubric.json
│
├── backend/                          ← PHASE 2: Django application
│   ├── mentriq/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── simulations/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── tasks/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   ├── interviews/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── admin.py
│   │   └── payments/
│   │       ├── models.py
│   │       ├── views.py
│   │       ├── serializers.py
│   │       └── urls.py
│   ├── services/
│   │   ├── ai/
│   │   │   ├── simulation_engine.py
│   │   │   ├── reviewer.py
│   │   │   ├── interview_agent.py
│   │   │   ├── team_persona.py
│   │   │   └── rag_service.py
│   │   ├── storage.py                ← Local filesystem storage (media/)
│   │   └── email_service.py          ← Console email (dev) / SMTP (prod)
│   ├── celery_tasks/
│   │   ├── __init__.py
│   │   └── ai_tasks.py
│   ├── prompts/
│   │   ├── simulation_system.txt
│   │   ├── reviewer_system.txt
│   │   ├── interview_system.txt
│   │   └── team_persona_system.txt
│   ├── utils/
│   │   ├── auth.py                   ← JWT auth (djangorestframework-simplejwt)
│   │   └── exceptions.py
│   ├── media/                        ← Local file uploads (student submissions)
│   ├── db.sqlite3                    ← SQLite database (zero config)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                         ← PHASE 3: Next.js 14 + Tailwind CSS
│   ├── app/                          ← Next.js App Router
│   │   ├── layout.tsx                ← Root layout (fonts, providers)
│   │   ├── page.tsx                  ← Landing page /
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          ← /login
│   │   │   └── register/
│   │   │       └── page.tsx          ← /register
│   │   ├── dashboard/
│   │   │   └── page.tsx              ← /dashboard (protected)
│   │   ├── simulation/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx          ← /simulation/[id]
│   │   ├── interview/
│   │   │   └── [interviewId]/
│   │   │       └── page.tsx          ← /interview/[id]
│   │   ├── evaluation/
│   │   │   └── [taskId]/
│   │   │       └── page.tsx          ← /evaluation/[id]
│   │   └── passport/
│   │       └── [userId]/
│   │           └── page.tsx          ← /passport/[id] (public)
│   ├── components/
│   │   ├── ui/                       ← Reusable primitives (shadcn/ui style)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── XPCard.tsx
│   │   │   ├── SimulationCard.tsx
│   │   │   ├── BadgeGrid.tsx
│   │   │   └── Leaderboard.tsx
│   │   ├── simulation/
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TeamChat.tsx
│   │   │   ├── CodeEditor.tsx        ← Monaco Editor wrapper
│   │   │   └── DeadlineTimer.tsx
│   │   ├── interview/
│   │   │   ├── ChatBubble.tsx
│   │   │   ├── TypingIndicator.tsx
│   │   │   └── ScoreReveal.tsx
│   │   └── evaluation/
│   │       ├── ScoreBar.tsx
│   │       ├── FeedbackCard.tsx
│   │       └── XPCelebration.tsx
│   ├── lib/
│   │   ├── api.ts                    ← Axios client (all API calls)
│   │   ├── auth.ts                   ← JWT helpers (store/read token)
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSimulation.ts
│   │   │   ├── usePoll.ts            ← Generic polling hook
│   │   │   └── useInterview.ts
│   │   └── utils.ts                  ← formatDate, XP calc, cn() helper
│   ├── styles/
│   │   └── globals.css               ← Tailwind base + custom CSS variables
│   ├── public/
│   │   ├── icons/
│   │   └── images/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Phase 1 — AI Pipelines (Jupyter Notebooks)

> **This is the current active phase.** All AI logic is built and tested here first. Once each notebook works and produces consistent output, it gets converted into a Django view + service in Phase 2.

### Notebook 01 — Simulation Engine

**File:** `notebooks/01_simulation_engine.ipynb`

**Purpose:** Given a career role and a simulation day number, this pipeline generates a realistic work day including tasks, a manager briefing, and a client scenario.

**Input:**
```python
{
  "role": "MERN Stack Developer",
  "day": 3,
  "previous_context": "...",
  "difficulty": "intermediate"
}
```

**Output (structured JSON):**
```python
{
  "manager_message": "...",
  "tasks": [
    {
      "task_id": "task_001",
      "title": "Fix Authentication Bug",
      "description": "...",
      "task_type": "bug_fix",
      "difficulty": "medium",
      "deadline_hours": 4,
      "client_context": "...",
      "expected_deliverable": "..."
    }
  ]
}
```

**AI Model:** Groq — `llama-3.3-70b-versatile`

**Key techniques:** RAG retrieval from Pinecone, JSON mode structured output, conversation memory for day continuity.

**Tests:**
- [ ] Generate tasks for 5 different roles — check realism
- [ ] Generate 10 consecutive days for 1 role — check tasks don't repeat
- [ ] Test edge case: day 1 (no previous context)
- [ ] Measure average tokens used per call
- [ ] Measure average response time

---

### Notebook 02 — AI Reviewer

**File:** `notebooks/02_ai_reviewer.ipynb`

**Purpose:** Evaluates student-submitted work and returns structured scores plus human-feel feedback.

**Input:**
```python
{
  "task": { ...task object... },
  "submission": {
    "content": "...",
    "submitted_at": "...",
    "deadline": "..."
  }
}
```

**Output:**
```python
{
  "overall_score": 78,
  "scores": {
    "code_quality": 80,
    "communication": 75,
    "problem_solving": 82,
    "time_management": 70,
    "completeness": 85
  },
  "xp_earned": 120,
  "feedback": "...",
  "strengths": ["..."],
  "improvement_suggestions": ["..."],
  "what_a_senior_would_say": "..."
}
```

**AI Model:** Groq — `llama-3.3-70b-versatile`

**Key techniques:** Evaluation rubrics injected from `data/evaluation_rubrics/`, chain-of-thought reasoning before scoring, task-type-aware system prompts.

**Tests:**
- [ ] Submit good vs bad solution — verify meaningful score difference
- [ ] Test empty submission — check graceful handling
- [ ] Test subtle code bugs — verify AI catches them
- [ ] Verify XP formula: `xp = base_xp * (score/100) * difficulty_multiplier`

---

### Notebook 03 — Interview Agent

**File:** `notebooks/03_interview_agent.ipynb`

**Purpose:** Multi-turn AI-conducted interview with scoring at the end.

**Interview types:** Technical, HR, Behavioral

**Per-turn input:**
```python
{
  "interview_type": "technical",
  "role": "MERN Stack Developer",
  "conversation_history": [],
  "user_message": "...",
  "simulation_context": "..."
}
```

**Conclusion output:**
```python
{
  "is_complete": True,
  "scores": {
    "technical_knowledge": 72,
    "communication": 85,
    "confidence": 68,
    "problem_solving": 78,
    "cultural_fit": 80
  },
  "overall_score": 77,
  "feedback": "...",
  "interview_summary": "..."
}
```

**AI Model:** Groq — `llama-3.1-8b-instant` (fast for multi-turn chat)

**Key techniques:** `ConversationBufferWindowMemory`, dynamic RAG question retrieval, sentiment scoring from transcript.

**Tests:**
- [ ] Full 10-turn technical interview — check question quality and follow-ups
- [ ] Test one-word answers — verify AI probes deeper
- [ ] Verify final score generates correctly after `is_complete: True`

---

### Notebook 04 — Team Persona Engine

**File:** `notebooks/04_team_persona_engine.ipynb`

**Purpose:** Generates Slack-style messages from AI teammates that react to student submissions.

**Personas:**
| Persona | Style | Trigger |
|---|---|---|
| Priya (Team Lead) | Professional, direct | Task assignments, deadline reminders |
| Karan (Senior Dev) | Casual, helpful | Code tips, "hey have you tried..." |
| Client (varies) | Formal email style | Requirement changes, feedback |
| Sneha (HR) | Warm, encouraging | Welcome, performance updates |

**Input:**
```python
{
  "persona": "team_lead",
  "trigger": "task_submitted",
  "context": { ...task + submission info... },
  "student_performance": "good"
}
```

**Output:**
```python
{
  "persona_name": "Priya",
  "persona_role": "Team Lead",
  "message": "Hey! Just saw your submission...",
  "message_type": "slack",
  "timestamp_offset_minutes": 15
}
```

**AI Model:** Groq — `llama-3.3-70b-versatile`

**Tests:**
- [ ] 5 messages per persona — verify consistent voice each time
- [ ] Karan vs Client for same event — verify tone difference
- [ ] Good submission vs bad — verify tone adjusts

---

### Notebook 05 — RAG Knowledge Base

**File:** `notebooks/05_rag_knowledge_base.ipynb`

**Purpose:** Loads all career knowledge, task templates, rubrics, and interview questions into Pinecone so other pipelines can retrieve role-specific context at runtime.

**Pinecone Index Structure:**
```
index: "mentriq-knowledge"
├── namespace: "career_knowledge"
├── namespace: "task_templates"
├── namespace: "evaluation_rubrics"
└── namespace: "interview_questions"
```

**Embedding model:** `text-embedding-3-large` (OpenAI)

**Tests:**
- [ ] `index.describe_index_stats()` — verify all docs indexed
- [ ] Query: "backend developer authentication task" → relevant tasks returned
- [ ] Query: "evaluate React component code" → correct rubric returned
- [ ] Retrieval time under 500ms

---

## Phase 2 — Backend (Django)

> All AI services, data storage, and API endpoints live here. **Zero paid infrastructure required for local development** — SQLite for the database, local filesystem for file storage, and console email backend for emails.

---

### Free Services Used

| Service | Free Alternative | Notes |
|---|---|---|
| PostgreSQL | **SQLite** (built-in) | Zero setup, file-based, switch to Postgres in prod |
| Cloudflare R2 | **Local filesystem** (`media/`) | Django's `FileSystemStorage` |
| Redis (for Celery) | **`django-db` backend** or `fakeredis` | Use `task_always_eager=True` in dev |
| Email | **Django console backend** | Prints emails to terminal in dev |
| Auth (Clerk) | **djangorestframework-simplejwt** | JWT auth, fully free, no third-party dependency |
| Sentry / PostHog | **Django logging** | Built-in Python logging to files |

---

### Authentication (JWT — No Clerk)

**File:** `backend/utils/auth.py`

Authentication uses Django's built-in user model + `djangorestframework-simplejwt`. No external auth service is needed. The frontend stores the JWT in `localStorage` and sends it as a Bearer token with every request.

**Register/Login views live in `apps/users/views.py`:**

```python
# apps/users/views.py
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer

class RegisterView(APIView):
    permission_classes = []   # public

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = []   # public

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = authenticate(username=email, password=password)
        if not user:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })
```

**`settings.py` JWT config:**
```python
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=24),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),
    "ALGORITHM": "HS256",
    "AUTH_HEADER_TYPES": ("Bearer",),
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "EXCEPTION_HANDLER": "utils.exceptions.custom_exception_handler",
}
```

---

### Database Setup (SQLite)

**File:** `backend/mentriq/settings.py`

```python
import environ, os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

# SQLite — zero config, file lives at backend/db.sqlite3
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
```

To switch to PostgreSQL in production, just replace the `DATABASES` block — all ORM code is identical.

---

### File Storage (Local Filesystem)

**File:** `backend/services/storage.py`

```python
import os, uuid
from pathlib import Path
from django.conf import settings
from django.core.files.storage import FileSystemStorage

UPLOAD_DIR = settings.BASE_DIR / "media" / "submissions"

fs = FileSystemStorage(location=str(UPLOAD_DIR), base_url="/media/submissions/")

def save_submission_file(file) -> str:
    """
    Saves an uploaded file to media/submissions/.
    Returns a relative URL path like /media/submissions/abc123.pdf
    """
    ext = Path(file.name).suffix
    filename = f"{uuid.uuid4()}{ext}"
    fs.save(filename, file)
    return f"/media/submissions/{filename}"

def get_file_path(relative_url: str) -> str:
    """Returns the absolute filesystem path for a stored file."""
    filename = Path(relative_url).name
    return str(UPLOAD_DIR / filename)
```

**`settings.py` media config:**
```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

**`urls.py` — serve media in development:**
```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    ...
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

### Email (Console Backend in Dev)

**`settings.py`:**
```python
# Development — prints emails to the terminal
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Production — switch to SMTP (Gmail free tier, or any SMTP)
# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.gmail.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = env("EMAIL_HOST_USER")
# EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")   # Gmail App Password
```

**File:** `backend/services/email_service.py`
```python
from django.core.mail import send_mail
from django.conf import settings

def send_welcome_email(user_email: str, user_name: str):
    send_mail(
        subject="Welcome to MentriQ Shadow 🧠",
        message=f"Hi {user_name}, your simulation workspace is ready.",
        from_email="noreply@mentriq.com",
        recipient_list=[user_email],
    )

def send_evaluation_ready_email(user_email: str, task_title: str, score: int):
    send_mail(
        subject=f"Your evaluation is ready — {task_title}",
        message=f"You scored {score}/100. Log in to view your full feedback.",
        from_email="noreply@mentriq.com",
        recipient_list=[user_email],
    )
```

---

### Async Tasks (Celery with SQLite Backend in Dev)

**`settings.py`:**
```python
# Development — no Redis needed, results stored in SQLite
CELERY_BROKER_URL = env("REDIS_URL", default="memory://")
CELERY_RESULT_BACKEND = "django-db"
CELERY_TASK_ALWAYS_EAGER = env.bool("CELERY_TASK_ALWAYS_EAGER", default=False)
# Set CELERY_TASK_ALWAYS_EAGER=True in .env to run tasks synchronously in dev
# (no separate Celery worker process needed)
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_EXPIRES = 3600
CELERY_ACCEPT_CONTENT = ["json"]
```

When `CELERY_TASK_ALWAYS_EAGER=True`, all `.delay()` calls run synchronously in the same process — you don't need to start a Celery worker during development.

---

### Backend Settings Summary

**File:** `backend/mentriq/settings.py`

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "django_celery_results",
    # Local apps
    "apps.users",
    "apps.simulations",
    "apps.tasks",
    "apps.interviews",
    "apps.payments",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",   # must be first
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=["http://localhost:3000"]
)
```

---

### AI Services (unchanged from Phase 1 logic)

All AI services in `backend/services/ai/` are direct conversions of the Jupyter notebooks. They use the same Groq and Pinecone calls — only the surrounding infrastructure (database, task queue, auth) changes.

| Notebook | Service File | Route |
|---|---|---|
| `01_simulation_engine.ipynb` | `services/ai/simulation_engine.py` | `POST /api/v1/simulations/{id}/generate-day` |
| `02_ai_reviewer.ipynb` | `services/ai/reviewer.py` | `POST /api/v1/tasks/{id}/evaluate` |
| `03_interview_agent.ipynb` | `services/ai/interview_agent.py` | `POST /api/v1/interviews/{id}/message` |
| `04_team_persona_engine.ipynb` | `services/ai/team_persona.py` | `POST /api/v1/simulations/{id}/team-message` |
| `05_rag_knowledge_base.ipynb` | `services/ai/rag_service.py` | Internal service only |

See the AI service implementation guides below — the logic and function signatures are identical to the original spec.

---

### AI Service: Simulation Engine

**File:** `backend/services/ai/simulation_engine.py`

```python
async def generate_simulation_day(
    role: str,
    day: int,
    previous_context: str,
    difficulty: str,
    session_id: str
) -> dict:
    ...
```

**Step 1 — RAG retrieval:** Call `rag_service.retrieve(namespace="task_templates", query=f"{role} day {day} tasks", top_k=5)`.

**Step 2 — Build prompt:** Load `backend/prompts/simulation_system.txt`. Inject role, day, difficulty, previous_context, retrieved_context.

**Step 3 — Call Groq:**
```python
from groq import Groq
client = Groq(api_key=settings.GROQ_API_KEY)
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Generate day {day} tasks for a {role} simulation."}
    ],
    response_format={"type": "json_object"},
    temperature=0.7,
    max_tokens=2000
)
```

**Step 4 — Parse and validate:** Parse JSON, validate schema, raise `SimulationGenerationError` if invalid.

**Step 5 — Log token usage:** `usage = response.usage` → store for cost tracking.

**Expected output:**
```json
{
  "manager_message": "Good morning! Today we have...",
  "tasks": [
    {
      "task_id": "task_001",
      "title": "Fix Authentication Bug",
      "description": "...",
      "task_type": "bug_fix",
      "difficulty": "medium",
      "deadline_hours": 4,
      "client_context": "...",
      "expected_deliverable": "..."
    }
  ]
}
```

---

### AI Service: AI Reviewer

**File:** `backend/services/ai/reviewer.py`

```python
async def evaluate_submission(
    task: dict,
    submission_content: str,
    submitted_at: str,
    deadline: str
) -> dict:
    ...
```

**Step 1 — Load rubric:** RAG query for `{task_type} evaluation rubric`.

**Step 2 — Time penalty:**
```python
delta_minutes = (submitted - due).total_seconds() / 60
if delta_minutes <= 0:    time_score = 100
elif delta_minutes <= 30: time_score = 80
elif delta_minutes <= 120:time_score = 60
else:                     time_score = 40
```

**Step 3–5 — Build prompt, call Groq with chain-of-thought, parse JSON block.**

**Step 6 — XP formula:**
```python
difficulty_multiplier = {"easy": 1.0, "medium": 1.5, "hard": 2.0}
xp_earned = int(100 * (overall_score / 100) * difficulty_multiplier[task["difficulty"]])
```

**Expected output:**
```json
{
  "overall_score": 78,
  "scores": { "code_quality": 80, "communication": 75, "problem_solving": 82,
              "time_management": 70, "completeness": 85 },
  "xp_earned": 120,
  "feedback": "...",
  "strengths": ["..."],
  "improvement_suggestions": ["..."],
  "what_a_senior_would_say": "..."
}
```

---

### AI Service: Interview Agent

**File:** `backend/services/ai/interview_agent.py`

```python
async def process_interview_turn(
    interview_type: str,
    role: str,
    conversation_history: list[dict],
    user_message: str,
    simulation_context: str
) -> dict:
    ...
```

Uses `llama-3.1-8b-instant` for fast multi-turn chat. Rebuilds full conversation each call (stateless). Concludes at 8–12 exchanges, then makes a second Groq call to generate final scores.

**Expected output at conclusion:**
```json
{
  "ai_response": "Thank you, that concludes our interview.",
  "is_complete": true,
  "scores": {
    "technical_knowledge": 72, "communication": 85,
    "confidence": 68, "problem_solving": 78, "cultural_fit": 80
  },
  "overall_score": 77,
  "feedback": "...",
  "interview_summary": "..."
}
```

---

### AI Service: Team Persona Engine

**File:** `backend/services/ai/team_persona.py`

```python
async def generate_team_message(
    persona: str,
    trigger: str,
    task: dict,
    submission_content: str,
    student_performance: str
) -> dict:
    ...
```

Four personas (Priya, Karan, Mr. Mehta, Sneha) with distinct tones. Uses temperature=0.8 for natural variation. Returns message + `timestamp_offset_minutes` for timed reveal in the UI.

---

### AI Service: RAG Service

**File:** `backend/services/ai/rag_service.py`

```python
async def retrieve(namespace: str, query: str, top_k: int = 5) -> list[str]:
    ...
```

Embeds query via `text-embedding-3-large`, queries Pinecone, returns text metadata from matches.

---

### API Routes — Full Specification

All routes return JSON. Protected routes require `Authorization: Bearer <jwt>`.

#### Auth Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | None | Register with email + password, returns JWT |
| POST | `/api/v1/auth/login` | None | Login, returns JWT |
| POST | `/api/v1/auth/token/refresh` | None | Refresh access token |

#### Simulation Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/simulations/start` | Required | Create new simulation session |
| GET | `/api/v1/simulations/{id}` | Required | Get session + current day tasks |
| POST | `/api/v1/simulations/{id}/generate-day` | Required | Queue Celery task to generate tasks |
| POST | `/api/v1/simulations/{id}/team-message` | Required | Get AI teammate message |

#### Task Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/tasks/{id}` | Required | Get task details |
| POST | `/api/v1/tasks/{id}/submit` | Required | Submit work, queue evaluation |
| GET | `/api/v1/tasks/{id}/evaluation` | Required | Get evaluation result |

#### Interview Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/interviews/start` | Required | Create interview session |
| POST | `/api/v1/interviews/{id}/message` | Required | Send message, get AI response |
| POST | `/api/v1/interviews/{id}/end` | Required | Force-conclude interview |

#### User Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/{id}/dashboard` | Required | XP, sessions, badges |
| GET | `/api/v1/users/{id}/passport` | None | Public Shadow Passport |

#### Utility Routes
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health/` | None | Health check |
| GET | `/api/v1/celery-tasks/{task_id}/status/` | Required | Poll task status |

---

## Phase 3 — Frontend (Next.js + Tailwind CSS)

> Built with **Next.js 14 App Router** and **Tailwind CSS**. TypeScript throughout. All API calls go through a central Axios client. Auth state is managed via React Context + JWT stored in `localStorage`.

---

### Design Direction

MentriQ Shadow targets students who are ambitious but unconfident — they've consumed content but never _done_ the work. The UI should feel like a **real workspace, not a learning app**.

**Visual identity:** Dark, dense, and purposeful. Inspired by developer tools (VS Code, Linear, Vercel dashboard) mixed with a startup energy. Every screen should feel like the student has been _hired_ — not enrolled.

**Design tokens:**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:          "#080B11",   // near-black, slightly blue
        surface:     "#0F1520",   // card backgrounds
        surface2:    "#172030",   // elevated surfaces
        border:      "#1E2D42",   // subtle borders
        primary:     "#3B82F6",   // blue-500 — action color
        "primary-dim":"#1D4ED8",  // pressed state
        accent:      "#10B981",   // emerald — success, XP
        warn:        "#F59E0B",   // amber — deadline warning
        danger:      "#EF4444",   // red — errors, overdue
        text:        "#E2E8F0",   // primary text
        muted:       "#64748B",   // secondary text
        "muted-2":   "#334155",   // placeholder text
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        card:    "0 4px 24px rgba(0,0,0,0.5)",
        glow:    "0 0 20px rgba(59,130,246,0.25)",
        "glow-accent": "0 0 20px rgba(16,185,129,0.25)",
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease both",
        "score-fill":"scoreFill 1s ease both",
        "pulse-glow":"pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scoreFill: {
          "0%":   { width: "0%" },
          "100%": { width: "var(--score-width)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

**Google Fonts — add to `app/layout.tsx`:**
```typescript
import { Syne, DM_Sans } from "next/font/google";

const syne = Syne({ subsets: ["latin"], weight: ["400","600","700","800"], variable: "--font-display" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400","500"], variable: "--font-body" });
```

---

### Prompt Engineering for Frontend Components

When building each component, use these prompts with any AI coding assistant to generate consistent, high-quality output.

#### Global Layout Prompt
```
Build a Next.js 14 root layout for a dark-themed developer tool called MentriQ Shadow.
Use Syne as the display font and DM Sans as the body font.
Background: #080B11. Surface cards: #0F1520. Borders: #1E2D42.
Action color: blue-500. Success/XP color: emerald-500.
Apply Tailwind CSS utility classes only — no custom CSS unless absolutely needed.
The layout includes: a fixed top navbar with logo + user avatar dropdown, 
and a collapsible left sidebar with nav links (Dashboard, Simulation, Interviews, Passport).
The main content area has padding-left equal to sidebar width.
Use `cn()` from clsx for conditional class merging.
Components are server components by default; add "use client" only where interactivity is needed.
```

#### Landing Page Prompt
```
Build a stunning dark landing page for MentriQ Shadow — an AI career simulation platform for Indian college students.
Tagline: "Experience the Job Before Getting the Job."

The page must feel like a premium SaaS product — think Linear, Vercel, or Raycast landing pages.
Sections (in order):
1. Hero: Large Syne display headline (72px), subheadline, two CTAs (Get Started → /register, See How It Works → scroll).
   Add a subtle animated gradient mesh background (CSS only, no canvas).
   Show a mockup of the simulation workspace as a dark UI card.
2. Problem: "The loop students are stuck in" — 3 pain points in cards with icons.
3. How It Works: 3-step horizontal timeline (Step 1: Pick a track, Step 2: Work the simulation, Step 3: Get your Passport).
4. Career Tracks: Horizontal scrollable card grid. Each card: track name, icon, difficulty badge, "Coming Soon" or "Live" tag.
5. Features: Bento grid layout (like Vercel's homepage). 6 feature tiles, 2 are larger.
   Features: AI Simulation Days, AI Reviewer, AI Interviews, Team Personas, Shadow Passport, Gamification.
6. Pricing: 3-column card layout (Free / Pro ₹299 / Elite ₹599). Pro card has a glowing blue border.
7. Footer: Logo, links, "Made in India for India 🇮🇳".

Use Tailwind CSS only. Dark background #080B11. Use emerald-400 for accent highlights.
Add scroll-triggered fade-up animations using Tailwind's `animate-fade-up` with staggered delays.
No placeholder images — use SVG icons and CSS shapes for mockups.
```

#### Dashboard Page Prompt
```
Build the student dashboard page for MentriQ Shadow using Next.js + Tailwind CSS.
This page is shown after login. Fetch data from GET /api/v1/users/{userId}/dashboard.

Layout: Left sidebar (fixed, collapsible) + scrollable main content area.
Background: #080B11. Cards: #0F1520 with border #1E2D42.

Sections to build:
1. Top greeting bar: "Good morning, [Name] 👋" in Syne font + date.
2. Stats row: 4 stat cards (Total XP, Career Level, Simulations Completed, Interview Score).
   Each card has a subtle left-color-border (blue for XP, emerald for level, etc.).
3. Active Simulations: Card grid (2 cols on desktop, 1 on mobile). Each card shows:
   - Career track name + icon
   - "Day 3 of 10" progress bar (use Tailwind + inline CSS for dynamic width)
   - Last activity timestamp
   - "Continue" button (blue, pill-shaped)
4. XP Progress: Full-width card with a horizontal progress bar from current level to next.
   Show current level badge (e.g., "Junior Dev") on left, next level on right.
5. Recent Badges: Horizontal scroll row of badge icons with names + earned date tooltips.
6. Leaderboard: Top 10 list for user's career track. Highlight current user's row in blue.

Use "use client" — all data is fetched with the custom useAuth + api hooks.
Show skeleton loaders while data loads (use Tailwind's `animate-pulse` on placeholder divs).
All animations: fade-up on mount with staggered delays using CSS animation-delay.
```

#### Simulation Workspace Prompt
```
Build the simulation workspace page for MentriQ Shadow — the most important page in the product.
This is where students actually "go to work." It must feel like a real company workspace.

Layout: Three-column split (no scrolling — 100vh):
- LEFT (280px fixed): AI Team Chat panel
- CENTER (flexible): Task Board + submission area
- RIGHT (320px fixed): Monaco code editor OR textarea (toggle based on task type)

LEFT — Team Chat:
  - Header: "Team" with online indicator dots
  - Messages from AI personas (Priya, Karan, Sneha, Mr. Mehta)
  - Each message: avatar circle with initials, name + role tag, message bubble, timestamp
  - Slack-style message grouping (same sender = no repeated avatar)
  - "Typing..." indicator with animated dots when waiting for persona response
  - Auto-scroll to bottom on new message

CENTER — Task Board:
  - Top bar: simulation name, "Day 3 of 10" badge, XP earned counter
  - Task cards in a vertical list. Each card:
    - Title + difficulty badge (green/yellow/red)
    - Description text (truncated with "Read more" expand)
    - Deadline countdown timer (red when < 30 min)
    - Status badge: Pending / Submitted / Evaluated
    - "Submit Task" button (blue, full-width, disabled after submission)
  - Completed tasks show score badge overlay

RIGHT — Editor:
  - Monaco Editor (dark theme, vs-dark) for coding tasks
  - Plain textarea (styled) for report/email tasks
  - Toggle button to switch between the two
  - File upload drop zone below editor (for design tasks)
  - "Submit" button at bottom with submission confirmation modal

State management: React useState + useReducer for task list + submission status.
Use polling via a custom usePoll hook (every 2s) for evaluation results.
All transitions: smooth 200ms ease. Panel borders: #1E2D42.
```

#### AI Interview Page Prompt
```
Build the AI interview page for MentriQ Shadow. This is a fullscreen chat interface
where a student is interviewed by an AI called "Meera."

Design: Dark, focused, distraction-free. The student is being interviewed — this should
feel like a real video call / chat interview, not a chatbot.

Layout:
- Fixed header: "Technical Interview — MERN Stack Developer" + timer counting up + "End Interview" button
- Chat area (scrollable, takes up ~75vh):
  - AI messages: left-aligned, Meera's avatar on left (blue circle, "M"), message bubble in #0F1520
  - User messages: right-aligned, blue bubble (#1D4ED8 → blue-700)
  - Timestamps below each message
  - Typing indicator (animated 3-dot pulsing) when AI is responding
- Fixed bottom input bar:
  - Large textarea (auto-resize, max 4 rows)
  - Send button (blue) — keyboard shortcut: Ctrl+Enter
  - Character count
  - "Think before you answer — interviews are timed" hint text

Interview conclusion:
  When is_complete = true:
  - Hide input bar
  - Show "Interview Complete 🎉" banner sliding up from bottom
  - Animate score cards in (staggered): Technical, Communication, Confidence, Problem Solving, Cultural Fit
  - Overall score in large Syne font with a circular progress ring
  - "View Full Report" button → dashboard

Use framer-motion for message entrance animations (slide in from side).
On mount, trigger Meera's opening greeting message.
```

#### Evaluation Page Prompt
```
Build the evaluation results page for MentriQ Shadow.
This page shows AI feedback after a task submission.

The page should feel like a "results reveal" — a rewarding, celebratory moment
when the student sees their score for the first time.

Layout (single scrollable page, centered, max-width 760px):

1. Score reveal hero (top of page):
   - Task title in muted text above
   - Large circular score indicator (SVG ring, animated fill) — number counts up from 0
   - Score label below: "Good Work" / "Needs Improvement" / "Excellent" based on range
   - XP earned: "+120 XP" in emerald, pops in with scale animation

2. Score breakdown (5 dimensions):
   - Each row: label on left, animated horizontal bar fills to score, number on right
   - Colors: green if > 75, yellow if 50-75, red if < 50
   - Labels: Code Quality, Communication, Problem Solving, Time Management, Completeness

3. Feedback section (card):
   - AI feedback paragraph
   - Strengths: bulleted list with ✓ icons in emerald
   - Improvement areas: bulleted list with → icons in amber
   - "What a Senior Would Say" callout box (distinct border-left in blue)

4. Team reaction (below feedback):
   - Shows 1-2 AI teammate messages reacting to the score (from team persona API)
   - Same style as simulation workspace chat bubbles

5. Bottom CTAs:
   - "Next Task →" (blue, primary)
   - "Start Interview" (outline style)
   - "Back to Dashboard" (ghost style)

Animations: All sections fade-up on scroll into view. Score ring animates on mount.
XP counter uses a number ticker animation.
Confetti burst (use canvas-confetti npm package) if score > 85.
```

---

### API Client

**File:** `frontend/lib/api.ts`

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
```

---

### Auth Context

**File:** `frontend/lib/hooks/useAuth.ts`

```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  subscription_plan: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const { data } = await api.post("/auth/register", { email, password, name });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

---

### Polling Hook

**File:** `frontend/lib/hooks/usePoll.ts`

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";

export function usePoll(
  fn: () => Promise<boolean>,   // return true to stop polling
  intervalMs = 2000,
  enabled = true
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    timerRef.current = setInterval(async () => {
      const done = await fn();
      if (done) stop();
    }, intervalMs);
    return stop;
  }, [enabled, fn, intervalMs, stop]);

  return { stop };
}

// Usage example in evaluation page:
// const { stop } = usePoll(async () => {
//   const { data } = await api.get(`/tasks/${taskId}/evaluation`);
//   if (data.status === "completed") {
//     setEvaluation(data);
//     return true;   // stop polling
//   }
//   return false;
// }, 2000, !evaluation);
```

---

### Route Protection

**File:** `frontend/components/layout/ProtectedRoute.tsx`

```typescript
"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-bg">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>;

  return <>{children}</>;
}
```

---

### Monaco Editor Component

**File:** `frontend/components/simulation/CodeEditor.tsx`

```typescript
"use client";

import { useEffect, useRef } from "react";
import type * as Monaco from "monaco-editor";

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
}: {
  value: string;
  onChange: (v: string) => void;
  language?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import Monaco to avoid SSR issues
    import("monaco-editor").then((monaco) => {
      editorRef.current = monaco.editor.create(containerRef.current!, {
        value,
        language,
        theme: "vs-dark",
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontFamily: "'JetBrains Mono', monospace",
      });
      editorRef.current.onDidChangeModelContent(() => {
        onChange(editorRef.current!.getValue());
      });
    });

    return () => editorRef.current?.dispose();
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="h-96 w-full rounded-card overflow-hidden" />;
}
```

**`next.config.ts` — disable SSR for Monaco:**
```typescript
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["monaco-editor"] =
      "monaco-editor/esm/vs/editor/editor.api";
    return config;
  },
};
export default nextConfig;
```

---

### Pages Overview

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/(auth)/login/page.tsx` | Email/password login |
| `/register` | `app/(auth)/register/page.tsx` | Email/password register |
| `/dashboard` | `app/dashboard/page.tsx` | Protected — student home |
| `/simulation/[sessionId]` | `app/simulation/[sessionId]/page.tsx` | Protected — workspace |
| `/interview/[interviewId]` | `app/interview/[interviewId]/page.tsx` | Protected — interview |
| `/evaluation/[taskId]` | `app/evaluation/[taskId]/page.tsx` | Protected — score reveal |
| `/passport/[userId]` | `app/passport/[userId]/page.tsx` | Public — shareable profile |

---

### Project Setup

```bash
# In frontend/
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# Install dependencies
npm install axios clsx tailwind-merge framer-motion monaco-editor canvas-confetti
npm install -D @types/canvas-confetti

# Dev server
npm run dev   # http://localhost:3000
```

**`frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## Tech Stack

### AI & ML
| Tool | Purpose |
|---|---|
| Groq `llama-3.3-70b-versatile` | Simulation engine, team personas, code review |
| Groq `llama-3.1-8b-instant` | Interview agent (fast multi-turn chat) |
| OpenAI `text-embedding-3-large` | RAG embeddings |
| LangChain | Chains, memory, RAG orchestration |
| LangSmith | AI pipeline tracing and debugging |
| Pinecone | Vector database (free tier: 1 index, 100k vectors) |

### Backend
| Tool | Purpose |
|---|---|
| Django 5 | Web framework |
| Django REST Framework | API views + serializers |
| djangorestframework-simplejwt | JWT auth (free, no external service) |
| django-cors-headers | CORS middleware |
| django-environ | `.env` loading |
| **SQLite** | Primary database (zero config, free, built-in) |
| Celery | Async task queue |
| django-celery-results | Task results in SQLite (no Redis needed in dev) |
| **Local filesystem** | File storage (`media/` dir, zero cost) |
| Django console email | Email in dev (no SMTP service needed) |

### Frontend
| Tool | Purpose |
|---|---|
| **Next.js 14 (App Router)** | React framework with SSR + routing |
| **Tailwind CSS** | Utility-first styling |
| TypeScript | Type safety |
| Axios | HTTP client with interceptors |
| Framer Motion | Animations |
| Monaco Editor | In-browser code editor |
| canvas-confetti | Score celebration effect |
| clsx + tailwind-merge | Conditional class merging |

### DevOps (Free Tiers)
| Tool | Purpose |
|---|---|
| Vercel (free) | Frontend hosting (Next.js native) |
| Railway / Render (free tier) | Backend Django hosting |
| LangSmith (free tier) | AI pipeline monitoring |

---

## Environment Variables

**`notebooks/.env`:**
```env
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk_...
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=mentriq-knowledge
PINECONE_ENVIRONMENT=us-east-1
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=mentriq-shadow
```

**`backend/.env`:**
```env
# Django
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True

# AI
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk_...
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=mentriq-knowledge
PINECONE_ENVIRONMENT=us-east-1
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=mentriq-shadow

# Celery (set to True in dev to skip starting a Celery worker)
CELERY_TASK_ALWAYS_EAGER=True

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Email (optional — defaults to console in dev)
# EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

**`frontend/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

> **No paid services required for local development.** SQLite + local filesystem + console email + Celery eager mode = zero infrastructure cost to get started.

---

## Data Flow

### Simulation flow

```
Student selects career track
      │
      ▼
POST /api/v1/simulations/start
  → Creates SimulationSession in SQLite
  → Returns session_id
      │
      ▼
POST /api/v1/simulations/{id}/generate-day
  → If CELERY_TASK_ALWAYS_EAGER=True: runs synchronously
  → Else: queues Celery task (result stored in SQLite via django-celery-results)
  → Calls RAG service (Pinecone) for task templates
  → Calls Groq (simulation engine)
  → Saves Task records to SQLite
      │
      ▼
Frontend polls GET /api/v1/celery-tasks/{task_id}/status/
  → Returns "processing" or "completed"
      │
      ▼
Student reads tasks, writes solution, clicks Submit
      │
      ▼
POST /api/v1/tasks/{id}/submit
  → Saves Submission to SQLite
  → Saves any files to media/ (local filesystem)
  → Queues Celery evaluation task
      │
      ▼
Celery: calls RAG (rubrics) → calls Groq (reviewer) → saves Evaluation to SQLite
      │
      ▼
Frontend polls GET /api/v1/tasks/{id}/evaluation → returns scores + feedback
      │
      ▼
POST /api/v1/simulations/{id}/team-message → returns AI teammate reaction
      │
      ▼
Student levels up → next day begins
```

---

## Database Schema Overview

```sql
-- All tables managed by Django ORM migrations
-- SQLite in development, swap to PostgreSQL in production (no code changes)

users             -- id, email, password_hash, name, subscription_plan, created_at
career_tracks     -- id, name, slug, description, difficulty_level
simulation_sessions -- id, user_id, career_track_id, status, current_day, total_days, xp_earned
tasks             -- id, session_id, title, description, task_type, difficulty, deadline_hours, status
submissions       -- id, task_id, user_id, content, file_paths (JSON array), submitted_at
evaluations       -- id, submission_id, overall_score, dimension_scores (JSON), feedback, xp_awarded
interview_sessions -- id, user_id, simulation_session_id, interview_type, transcript (JSON), scores
user_badges       -- id, user_id, badge_slug, awarded_at
```

---

## Career Tracks

| Track | Phase | Status |
|---|---|---|
| MERN Stack Developer | MVP | 🔄 Building |
| Frontend Developer | V2 | ⏳ Planned |
| UI/UX Designer | V2 | ⏳ Planned |
| Data Analyst | V2 | ⏳ Planned |
| Backend Developer | V3 | ⏳ Planned |
| HR Executive | V3 | ⏳ Planned |

---

## Gamification System

| Element | Description |
|---|---|
| XP Points | `base_xp × (score/100) × difficulty_multiplier` |
| Career Level | Levels 1–10 based on total XP |
| Badges | "First Submission", "Bug Slayer", "Interview Ace", "7-Day Streak" |
| Daily Streak | Consecutive days with at least one submission |
| Leaderboard | Weekly XP ranking within each career track |
| Shadow Passport | Public URL showing all performance data |

---

## Monetization

| Plan | Price | Includes |
|---|---|---|
| Free | ₹0 | 1 simulation (7 days), basic feedback |
| Student Pro | ₹299/month | Unlimited simulations, 5 AI interviews/month, Shadow Passport |
| Student Elite | ₹599/month | Everything + unlimited interviews, code sandbox |
| College License | ₹50,000–₹5,00,000/year | Bulk accounts, placement analytics |

---

## Running the Project Locally

### Phase 1 — Notebooks

```bash
cd mentriq-shadow/notebooks
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in GROQ_API_KEY, OPENAI_API_KEY, PINECONE_API_KEY

jupyter notebook 05_rag_knowledge_base.ipynb   # run RAG setup first
jupyter notebook 01_simulation_engine.ipynb
```

### Phase 2 — Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in GROQ_API_KEY, OPENAI_API_KEY, PINECONE_API_KEY
# Set CELERY_TASK_ALWAYS_EAGER=True to skip starting a Celery worker

# SQLite is automatic — no database setup needed
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Load initial career track data
python manage.py loaddata career_tracks.json

# Start development server
python manage.py runserver 8000
# Django Admin: http://localhost:8000/admin/

# If CELERY_TASK_ALWAYS_EAGER=False, start a worker in a separate terminal:
# celery -A mentriq worker --loglevel=info
```

### Phase 3 — Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

npm run dev   # http://localhost:3000
```

---

## Important Notes for AI-Assisted Development

**Prompts are the product.** The `.txt` files in `backend/prompts/` control output quality. Write them manually and test carefully.

**Never hardcode API keys.** All keys go in `.env`. The `NEXT_PUBLIC_` prefix exposes values to the browser — only the API base URL should have it.

**Always use structured output.** Every Groq call uses `response_format={"type": "json_object"}` and the response is validated against the schemas in this README.

**Test notebooks before converting.** A notebook that works 80% of the time is not ready for a Django view. Aim for 95%+ consistent output.

**Frontend calls backend only through `lib/api.ts`.** Never write raw `fetch()` or `axios()` calls in page/component files — always import from `@/lib/api`.

**Poll, don't websocket (MVP).** AI evaluation takes 3–8 seconds. Use the `usePoll` hook at 2s intervals. WebSockets are V2.

**SQLite → PostgreSQL migration:** When deploying to production, update only the `DATABASES` block in `settings.py`. All ORM queries, migrations, and app code stay identical.

**LangSmith is your AI debugger.** Set `LANGCHAIN_TRACING_V2=true` — every LangChain call is logged automatically.

---

*Built with ❤️ to bridge the gap between education and employment.*