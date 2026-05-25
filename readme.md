# MentriQ Shadow 🧠

> **"Experience the Job Before Getting the Job."**

An AI-powered career simulation platform where students work in a virtual company environment — completing real tasks, getting AI-reviewed feedback, practicing interviews, and collaborating with AI teammates — before ever applying for a job.

---

## Table of Contents

- [What We Are Building](#what-we-are-building)
- [Project Status](#project-status)
- [Repository Structure](#repository-structure)
- [Phase 1 — AI Pipelines (Jupyter Notebooks)](#phase-1--ai-pipelines-jupyter-notebooks)
  - [Notebook 01 — Simulation Engine](#notebook-01--simulation-engine)
  - [Notebook 02 — AI Reviewer](#notebook-02--ai-reviewer)
  - [Notebook 03 — Interview Agent](#notebook-03--interview-agent)
  - [Notebook 04 — Team Persona Engine](#notebook-04--team-persona-engine)
  - [Notebook 05 — RAG Knowledge Base](#notebook-05--rag-knowledge-base)
- [Phase 2 — Backend (FastAPI)](#phase-2--backend-fastapi)
- [Phase 3 — Frontend (React)](#phase-3--frontend-react)
- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Data Flow](#data-flow)
- [Database Schema Overview](#database-schema-overview)
- [API Endpoints Overview](#api-endpoints-overview)
- [Career Tracks](#career-tracks)
- [Gamification System](#gamification-system)
- [Monetization](#monetization)
- [Running the Project Locally](#running-the-project-locally)
- [Contribution Guide](#contribution-guide)

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
- **Phase 2** — Convert notebooks into a FastAPI backend with proper routing
- **Phase 3** — Build the React frontend that calls the API

---

## Project Status

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Jupyter Notebook AI Pipelines | 🔄 In Progress |
| Phase 2 | FastAPI Backend + Database | ⏳ Not Started |
| Phase 3 | React Frontend | ⏳ Not Started |

---

## Repository Structure

```
mentriq-shadow/
│
├── notebooks/                        ← PHASE 1: All AI pipelines (start here)
│   ├── 01_simulation_engine.ipynb    ← Generates tasks, deadlines, client scenarios
│   ├── 02_ai_reviewer.ipynb          ← Evaluates submitted work + gives feedback
│   ├── 03_interview_agent.ipynb      ← Multi-turn AI interview with scoring
│   ├── 04_team_persona_engine.ipynb  ← AI teammates (Slack-style messages)
│   ├── 05_rag_knowledge_base.ipynb   ← Loads career knowledge into Pinecone
│   ├── requirements.txt              ← Python dependencies for notebooks
│   └── data/
│       ├── career_knowledge/         ← Job descriptions, workflows, industry docs
│       │   ├── mern_developer.json
│       │   ├── ui_ux_designer.json
│       │   └── data_analyst.json
│       ├── task_templates/           ← Pre-written task scenarios per role
│       │   ├── mern_tasks.json
│       │   └── hr_tasks.json
│       └── evaluation_rubrics/       ← Scoring criteria per task type
│           ├── code_review_rubric.json
│           ├── communication_rubric.json
│           └── design_rubric.json
│
├── backend/                          ← PHASE 2: FastAPI application
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── simulation.py         ← Built from notebook 01
│   │   │   ├── evaluation.py         ← Built from notebook 02
│   │   │   ├── interview.py          ← Built from notebook 03
│   │   │   ├── team_chat.py          ← Built from notebook 04
│   │   │   └── users.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── simulation.py
│   │   │   ├── task.py
│   │   │   ├── submission.py
│   │   │   └── evaluation.py
│   │   ├── schemas/                  ← Pydantic request/response models
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── simulation_engine.py
│   │   │   │   ├── reviewer.py
│   │   │   │   ├── interview_agent.py
│   │   │   │   └── rag_service.py
│   │   │   ├── storage.py
│   │   │   └── email.py
│   │   ├── tasks/                    ← Celery async tasks
│   │   │   ├── celery_app.py
│   │   │   └── ai_tasks.py
│   │   └── prompts/                  ← All LLM system prompts as .txt files
│   │       ├── simulation_system.txt
│   │       ├── reviewer_system.txt
│   │       ├── interview_system.txt
│   │       └── team_persona_system.txt
│   ├── alembic/                      ← Database migrations
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                         ← PHASE 3: React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── simulation/
│   │   │   ├── interview/
│   │   │   └── dashboard/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Simulation.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Profile.jsx
│   │   ├── store/                    ← Zustand global state
│   │   ├── hooks/
│   │   ├── api/                      ← Axios API client
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml                ← Local dev: PostgreSQL + Redis
├── .env.example                      ← All required environment variables
└── README.md
```

---

## Phase 1 — AI Pipelines (Jupyter Notebooks)

> **This is the current active phase.** All AI logic is built and tested here first. Once each notebook works correctly and produces consistent, high-quality output, it gets converted into a FastAPI route in Phase 2.

### Why Notebooks First?

- Test AI responses quickly without worrying about servers or frontends
- Iterate on prompts in minutes, not hours
- Measure output quality before writing production code
- Understand token costs and latency per pipeline
- Catch edge cases before they reach users

---

### Notebook 01 — Simulation Engine

**File:** `notebooks/01_simulation_engine.ipynb`

**Purpose:** The core of the platform. Given a career role and a simulation day number, this pipeline generates a realistic work day for the student.

**What it generates:**
- A briefing message from the AI "manager" (e.g., "Good morning! Today we have a client who wants to change the login flow...")
- 1–3 tasks with titles, descriptions, requirements, and deadlines
- A client email or Slack message with the full context
- Optional: a bug report, a design brief, or a data analysis request

**Inputs:**
```python
{
  "role": "MERN Stack Developer",
  "day": 3,
  "previous_context": "...",   # summary of what happened on days 1-2
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
      "task_type": "bug_fix",       # coding | design | report | meeting | bug_fix
      "difficulty": "medium",
      "deadline_hours": 4,
      "client_context": "...",      # the 'email from client' the student reads
      "expected_deliverable": "..."
    }
  ]
}
```

**AI Model:** Grok (xAI) — `grok-3` (best for coherent narrative + structured output)

**Key techniques used:**
- System prompt with role persona and company context
- RAG retrieval from Pinecone to get role-specific task templates (built in notebook 05)
- Structured output (JSON mode) so the backend can parse reliably
- Conversation memory to maintain continuity across simulation days

**Tests to run in this notebook:**
- [ ] Generate tasks for 5 different roles — check realism
- [ ] Generate 10 consecutive days for 1 role — check that tasks don't repeat
- [ ] Test edge case: day 1 (no previous context)
- [ ] Measure average tokens used per call
- [ ] Measure average response time

---

### Notebook 02 — AI Reviewer

**File:** `notebooks/02_ai_reviewer.ipynb`

**Purpose:** When a student submits their work, this pipeline evaluates it and returns structured feedback with scores.

**What it evaluates:**
- Code quality (for coding tasks)
- Communication quality (for emails, reports, meeting notes)
- Problem-solving approach
- Time management (did they meet the deadline?)
- Completeness (did they address all requirements?)

**Inputs:**
```python
{
  "task": { ...task object from notebook 01... },
  "submission": {
    "content": "...",           # student's code, text, or description
    "submitted_at": "...",
    "deadline": "..."
  }
}
```

**Output (structured JSON):**
```python
{
  "overall_score": 78,          # 0–100
  "scores": {
    "code_quality": 80,
    "communication": 75,
    "problem_solving": 82,
    "time_management": 70,
    "completeness": 85
  },
  "xp_earned": 120,
  "feedback": "Your solution correctly handles the authentication flow, however...",
  "strengths": ["..."],
  "improvement_suggestions": ["..."],
  "what_a_senior_would_say": "..."   # human-feel advice line
}
```

**AI Model:** Grok (xAI) — `grok-3` for all task types (code review, communication, and written evaluation)

**Key techniques used:**
- Evaluation rubrics loaded from `data/evaluation_rubrics/` and passed as context
- Single-model routing via Grok with task-type-aware system prompts
- Chain of thought reasoning (ask the model to reason before scoring)
- Structured output for consistent scoring format

**Tests to run in this notebook:**
- [ ] Submit a good solution and a bad solution — verify scores differ meaningfully
- [ ] Test with empty submission — check graceful handling
- [ ] Test with code that has subtle bugs — check if the AI catches them
- [ ] Test with a well-written vs poorly-written email — check communication scoring
- [ ] Verify XP formula: `xp = base_xp * (score/100) * difficulty_multiplier`

---

### Notebook 03 — Interview Agent

**File:** `notebooks/03_interview_agent.ipynb`

**Purpose:** After completing simulations, students can take an AI-conducted interview. This is a multi-turn conversation where the AI asks questions, listens to answers, asks follow-up questions, and scores the student at the end.

**Interview types:**
- **Technical** — role-specific coding/concept questions
- **HR** — behavioral questions (why this role, teamwork, conflict resolution)
- **Behavioral** — situation-based questions (STAR format)

**Conversation flow:**
```
AI: "Tell me about yourself and why you want this role."
Student: "..."
AI: [follow-up based on what they said, or moves to next topic]
... (8–12 exchanges) ...
AI: "Thank you, that concludes our interview. You'll receive your feedback shortly."
[Pipeline generates final score report]
```

**Inputs:**
```python
{
  "interview_type": "technical",
  "role": "MERN Stack Developer",
  "conversation_history": [],    # grows with each exchange
  "user_message": "...",
  "simulation_context": "..."    # what skills they demonstrated during simulation
}
```

**Output per turn:**
```python
{
  "ai_response": "...",
  "is_complete": False,
  "next_action": "continue"      # continue | conclude
}
```

**Output at conclusion:**
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

**AI Model:** Grok (xAI) — `grok-3-mini` (fast, cost-efficient, conversational — perfect for back-and-forth chat)

**Key techniques used:**
- `ConversationBufferWindowMemory` from LangChain — AI remembers what was said earlier in the interview
- Dynamic question bank: questions pulled from RAG based on role + what student has already answered
- Sentiment and confidence scoring from transcript at the end
- System prompt persona: "You are a professional interviewer at a mid-size tech company. Be professional but friendly. Ask follow-up questions when answers are vague."

**Tests to run in this notebook:**
- [ ] Run a full 10-turn technical interview — check question quality and follow-ups
- [ ] Run a full HR interview — check for behavioral question coverage
- [ ] Test with one-word answers — check that AI probes deeper
- [ ] Test with very long, detailed answers — check AI summarizes and moves on
- [ ] Verify final score is generated correctly after `is_complete: True`

---

### Notebook 04 — Team Persona Engine

**File:** `notebooks/04_team_persona_engine.ipynb`

**Purpose:** Students don't work alone in real companies. This pipeline generates realistic Slack-style messages from AI teammates — a team lead, a senior developer, a client, and an HR person. These messages add texture and realism to the simulation.

**Personas generated:**
| Persona | Communication Style | When They Message |
|---|---|---|
| Priya (Team Lead) | Professional, direct, uses bullet points | Task assignments, check-ins, deadline reminders |
| Karan (Senior Dev) | Casual, helpful, uses slang | Code tips, "hey have you tried..." |
| Client (varies) | Formal email style, sometimes urgent | Requirement changes, feedback on deliverables |
| Sneha (HR) | Warm, encouraging | Welcome messages, performance updates |

**Inputs:**
```python
{
  "persona": "team_lead",        # team_lead | senior_dev | client | hr
  "trigger": "task_submitted",   # what just happened
  "context": { ...task + submission info... },
  "student_performance": "good"  # good | needs_improvement | excellent
}
```

**Output:**
```python
{
  "persona_name": "Priya",
  "persona_role": "Team Lead",
  "message": "Hey! Just saw your submission on the auth bug fix. Good work catching the token expiry issue — one thing though, did you handle the refresh token edge case? Check line 47 of your code. Deadline's in 2 hours, loop back if you need help. 🙌",
  "message_type": "slack",       # slack | email
  "timestamp_offset_minutes": 15  # how many minutes after submission this appears
}
```

**AI Model:** Grok (xAI) — `grok-3` (excellent at persona consistency and natural, expressive conversation)

**Key techniques used:**
- Strong persona definitions in the system prompt (name, age, years of experience, communication quirks)
- Persona memory: each persona "remembers" their previous messages to the student
- Context injection: the message must reference the actual task the student just submitted
- Temperature tuning: slightly higher temperature for more natural, varied messages

**Tests to run in this notebook:**
- [ ] Generate 5 messages from each persona — check they sound like the same person each time
- [ ] Test Karan (casual) and Client (formal) messages for the same event — verify tone difference
- [ ] Test message after a bad submission vs a good one — check tone adjusts appropriately
- [ ] Verify messages reference actual task details (not generic)

---

### Notebook 05 — RAG Knowledge Base

**File:** `notebooks/05_rag_knowledge_base.ipynb`

**Purpose:** This notebook builds the knowledge foundation that all other notebooks draw from. It loads structured career knowledge, task templates, and evaluation rubrics into Pinecone (a vector database) so that the AI pipelines can retrieve relevant, role-specific context at runtime.

**Why RAG?**

Without RAG, the simulation engine would generate generic tasks. With RAG, when a student picks "MERN Stack Developer", the engine retrieves real-world task patterns, common bugs, industry workflows, and code standards specific to that role — making the simulation feel authentic.

**What gets indexed into Pinecone:**
```
pinecone index: "mentriq-knowledge"
│
├── namespace: "career_knowledge"
│   ├── MERN developer job descriptions (10+ docs)
│   ├── MERN developer day-to-day workflows
│   ├── Common MERN bugs and how companies handle them
│   └── Tech stack expectations per company size
│
├── namespace: "task_templates"
│   ├── 50+ pre-written task scenarios per role
│   └── Client email templates, bug reports, design briefs
│
├── namespace: "evaluation_rubrics"
│   ├── Code review rubric (what makes code good/bad)
│   ├── Communication rubric (email quality, report clarity)
│   └── Problem-solving rubric (approach, solution quality)
│
└── namespace: "interview_questions"
    ├── Technical question bank per role
    ├── HR question bank (general)
    └── Common follow-up questions
```

**Inputs:** Raw JSON/text files from `notebooks/data/`

**Outputs:** Populated Pinecone index, tested with similarity queries

**Embedding model:** `text-embedding-3-large` (OpenAI) — used for RAG embeddings only, as xAI does not currently provide a dedicated embedding API. All chat/generation calls use Grok.

**Tests to run in this notebook:**
- [ ] Verify all documents are indexed: `index.describe_index_stats()`
- [ ] Query test 1: "backend developer authentication task" → should return relevant tasks
- [ ] Query test 2: "how to evaluate React component code" → should return correct rubric
- [ ] Query test 3: "interview question for data analyst" → should return relevant questions
- [ ] Measure retrieval time — should be under 500ms
- [ ] Test with a role that has few documents — verify graceful fallback

---

## Phase 2 — Backend (FastAPI)

> **Not started yet.** Will begin after all 5 notebooks produce reliable, tested output.

Each notebook becomes a FastAPI router:

| Notebook | FastAPI Route |
|---|---|
| `01_simulation_engine.ipynb` | `POST /api/v1/simulations/{id}/generate-day` |
| `02_ai_reviewer.ipynb` | `POST /api/v1/tasks/{id}/evaluate` |
| `03_interview_agent.ipynb` | `POST /api/v1/interviews/{id}/message` |
| `04_team_persona_engine.ipynb` | `POST /api/v1/simulations/{id}/team-message` |
| `05_rag_knowledge_base.ipynb` | Internal service (no direct API route) |

The conversion process for each notebook:
1. Extract the core logic into a Python function
2. Move the function into `backend/app/services/ai/`
3. Create a Pydantic schema for input/output
4. Wrap in a FastAPI route with auth + error handling
5. Move long-running calls (AI evaluation, simulation generation) to Celery async tasks

---

## Phase 3 — Frontend (React)

> **Not started yet.** Will begin after the backend API is running.

Key screens:
- **Landing page** — hero, how it works, pricing
- **Auth** — signup/login via Clerk
- **Career Track Selection** — grid of available simulations
- **Simulation Workspace** — task board, code editor, AI manager message, team chat
- **Submission Screen** — submit code/text, see "AI is reviewing..." state
- **Evaluation Screen** — score breakdown, feedback, XP earned
- **Interview Screen** — multi-turn chat with AI interviewer
- **Dashboard** — progress, XP, badges, leaderboard
- **Shadow Passport** — public profile URL with all performance data

---

## Tech Stack

### AI & ML
| Tool | Purpose |
|---|---|
| Grok `grok-3` (xAI) | Simulation engine, team personas, code review, communication evaluation |
| Grok `grok-3-mini` (xAI) | Interview agent (fast + cost-efficient for multi-turn chat) |
| text-embedding-3-large (OpenAI) | Document embeddings for RAG (xAI has no embedding API yet) |
| LangChain | Chains, memory, RAG orchestration |
| LangGraph | Agent loops for simulation engine |
| Pinecone | Vector database for RAG knowledge base |
| LangSmith | LLM call tracing, prompt debugging, evals |

### Backend (Phase 2)
| Tool | Purpose |
|---|---|
| FastAPI | API framework (async, Python) |
| PostgreSQL (Supabase) | Primary database |
| Redis (Upstash) | Cache + Celery message broker |
| Celery | Async task queue for long AI calls |
| SQLAlchemy + Alembic | ORM + database migrations |
| Clerk | Authentication (JWT + Google OAuth) |
| Cloudflare R2 | File storage (code submissions, uploaded files) |
| Resend | Transactional email |

### Frontend (Phase 3)
| Tool | Purpose |
|---|---|
| React + Vite | UI framework |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| Axios | HTTP client |
| Monaco Editor | In-browser code editor |
| Clerk React SDK | Auth components |

### DevOps & Monitoring
| Tool | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Railway | Backend + Celery worker hosting |
| Sentry | Error monitoring |
| PostHog | Product analytics + session recording |
| LangSmith | AI pipeline monitoring |

---

## Environment Variables

Create a `.env` file in the `notebooks/` folder for Phase 1.
Create a `.env` file in the `backend/` folder for Phase 2.

```env
# ── AI APIs ──────────────────────────────────────────
XAI_API_KEY=xai-...

# ── Pinecone (RAG) ───────────────────────────────────
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=mentriq-knowledge
PINECONE_ENVIRONMENT=us-east-1

# ── LangSmith (optional but recommended for debugging) ─
LANGCHAIN_API_KEY=...
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=mentriq-shadow

# ── Database (Phase 2 only) ──────────────────────────
DATABASE_URL=postgresql://user:password@host:5432/mentriq

# ── Redis (Phase 2 only) ─────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Auth — Clerk (Phase 2 only) ──────────────────────
CLERK_SECRET_KEY=sk_...
CLERK_PUBLISHABLE_KEY=pk_...

# ── Storage — Cloudflare R2 (Phase 2 only) ───────────
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=mentriq-submissions

# ── Payments — Razorpay (Phase 2 only) ───────────────
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...

# ── Email — Resend (Phase 2 only) ────────────────────
RESEND_API_KEY=re_...
```

> **Never commit the `.env` file to Git.** It is listed in `.gitignore` by default.

---

## Data Flow

### Simulation flow (how a student's day works)

```
Student selects role
      │
      ▼
[Notebook 01] Simulation Engine
  → Retrieves role context from Pinecone (Notebook 05 data)
  → Calls Grok grok-3
  → Returns: manager message + task list
      │
      ▼
Student reads tasks and submits work
      │
      ▼
[Notebook 02] AI Reviewer
  → Retrieves evaluation rubric from Pinecone
  → Calls Grok grok-3 (code + written tasks)
  → Returns: scores + feedback + XP earned
      │
      ▼
[Notebook 04] Team Persona Engine
  → Generates teammate reaction to submission
  → Returns: Slack-style message from AI teammate
      │
      ▼
Student levels up, next day begins
```

### Interview flow

```
Student completes simulation
      │
      ▼
Student starts interview
      │
      ▼
[Notebook 03] Interview Agent
  → Retrieves questions from Pinecone (Notebook 05 data)
  → Multi-turn conversation loop (Grok grok-3-mini)
  → Each turn: student message → AI question/follow-up
      │
      ▼
After 8-12 exchanges: interview concludes
  → Final scoring generated
  → Shadow Passport updated
```

---

## Database Schema Overview

> Full schema lives in `backend/alembic/` once Phase 2 begins.
> This is a reference for understanding data relationships.

```
users
  id, email, name, clerk_id, subscription_plan, created_at

career_tracks
  id, name, slug, description, difficulty_level
  examples: "MERN Stack Developer", "UI/UX Designer", "Data Analyst"

simulation_sessions
  id, user_id → users, career_track_id → career_tracks
  status (active | completed | abandoned)
  current_day, total_days (default 10)
  xp_earned, industry_readiness_score
  started_at, completed_at

tasks
  id, session_id → simulation_sessions
  title, description, task_type (coding | design | report | meeting | bug_fix)
  difficulty, deadline_hours, status (pending | submitted | evaluated)
  ai_generated_context (JSON — the client email, bug report, etc.)

submissions
  id, task_id → tasks, user_id → users
  content (text — code or written response)
  file_urls (array — uploaded files from R2)
  submitted_at

evaluations
  id, submission_id → submissions
  overall_score, code_quality_score, communication_score
  problem_solving_score, time_management_score
  feedback, improvement_suggestions (JSON)
  xp_awarded, evaluated_at

interview_sessions
  id, user_id → users, simulation_session_id → simulation_sessions
  interview_type (technical | hr | behavioral)
  transcript (JSON — array of {role, content} messages)
  confidence_score, communication_score, technical_score
  completed_at
```

---

## API Endpoints Overview

> Full implementation in Phase 2. Listed here so the notebooks can be built with the right output shapes.

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login

GET    /api/v1/career-tracks
POST   /api/v1/simulations/start              { career_track_id }
GET    /api/v1/simulations/:id
POST   /api/v1/simulations/:id/generate-day   → calls notebook 01 logic
POST   /api/v1/simulations/:id/team-message   → calls notebook 04 logic

GET    /api/v1/tasks/:id
POST   /api/v1/tasks/:id/submit               { content, file_urls }
GET    /api/v1/tasks/:id/evaluation            → calls notebook 02 logic

POST   /api/v1/interviews/start               { simulation_id, type }
POST   /api/v1/interviews/:id/message         { content } → calls notebook 03 logic
POST   /api/v1/interviews/:id/end

GET    /api/v1/users/:id/dashboard
GET    /api/v1/users/:id/passport             (public — no auth required)

POST   /api/v1/payments/subscribe
POST   /api/v1/payments/webhook               (Razorpay webhook)
```

---

## Career Tracks

Tracks available at launch and planned for later:

| Track | Phase | Status |
|---|---|---|
| MERN Stack Developer | MVP (Phase 1 focus) | 🔄 Building |
| Frontend Developer | V2 | ⏳ Planned |
| UI/UX Designer | V2 | ⏳ Planned |
| Data Analyst | V2 | ⏳ Planned |
| Backend Developer | V3 | ⏳ Planned |
| HR Executive | V3 | ⏳ Planned |
| Digital Marketer | V3 | ⏳ Planned |
| Business Analyst | V3 | ⏳ Planned |
| Data Scientist | V4 | ⏳ Planned |
| Startup Founder | V4 | ⏳ Planned |

> **Phase 1 notebook focus:** Build all 5 notebooks only for the **MERN Stack Developer** track. Validate everything works end-to-end for one track before building data for others.

---

## Gamification System

| Element | Description |
|---|---|
| XP Points | Earned on every task submission. Formula: `base_xp × (score/100) × difficulty_multiplier` |
| Career Level | Levels 1–10 based on total XP accumulated |
| Badges | Awarded for milestones: "First Submission", "Bug Slayer", "Interview Ace", etc. |
| Daily Streak | Consecutive days with at least one task completed |
| Leaderboard | Weekly ranking by XP within a career track |
| Shadow Passport | Public profile URL showing all simulations + performance scores |

---

## Monetization

| Plan | Price | Includes |
|---|---|---|
| Free | ₹0 | 1 simulation (7 days), basic feedback, no certificate |
| Student Pro | ₹299/month | Unlimited simulations, 5 AI interviews/month, Shadow Passport, PDF report |
| Student Elite | ₹599/month | Everything + unlimited interviews, code sandbox, peer collaboration |
| College License | ₹50,000–₹5,00,000/year | Bulk student accounts, placement analytics, custom tracks |
| Company Sponsored | ₹2,00,000–₹10,00,000 per track | Branded simulation, top-performer hiring pipeline |

---

## Running the Project Locally

### Phase 1 — Notebooks Only

```bash
# 1. Clone the repository
git clone https://github.com/your-username/mentriq-shadow.git
cd mentriq-shadow

# 2. Create a virtual environment
cd notebooks
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file
cp .env.example .env
# Edit .env and add your API keys (XAI_API_KEY, PINECONE_API_KEY)

# 5. Start with the RAG notebook first (it builds the knowledge base)
jupyter notebook 05_rag_knowledge_base.ipynb

# 6. Then run the simulation engine
jupyter notebook 01_simulation_engine.ipynb

# 7. Then the reviewer, interview agent, and team personas
jupyter notebook 02_ai_reviewer.ipynb
jupyter notebook 03_interview_agent.ipynb
jupyter notebook 04_team_persona_engine.ipynb
```

### Phase 2 — Backend (once Phase 1 is complete)

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Start PostgreSQL and Redis (Docker required)
docker-compose up -d

# Run migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000

# In a separate terminal: start Celery worker
celery -A app.tasks.celery_app worker --loglevel=info
```

### Phase 3 — Frontend (once Phase 2 is running)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## Contribution Guide

> This section will be expanded once the project reaches Phase 2.

**Branch naming:**
- `feat/notebook-01-simulation-engine` — new feature
- `fix/reviewer-score-calculation` — bug fix
- `test/interview-agent-edge-cases` — adding tests

**Commit message format:**
```
feat(notebooks): add conversation memory to interview agent
fix(reviewer): handle empty submission gracefully
docs(readme): update API endpoints section
```

**Before opening a pull request:**
- [ ] All tests in the relevant notebook pass
- [ ] No API keys are committed to code
- [ ] Output format matches the schema defined in this README

---

## Important Notes for AI-Assisted Development (Vibe Coding)

If you are using an AI coding assistant (Cursor, GitHub Copilot, Claude, etc.) to help build this project, read these notes carefully:

**Prompts are the product.** The system prompts stored in `backend/app/prompts/` are the most important files in this codebase. They control the quality of every simulation, every evaluation, and every interview. Do not auto-generate them. Write them carefully and test them manually.

**Never hardcode API keys.** All API keys go in `.env`. If an AI assistant generates code with a key hardcoded, remove it immediately.

**Always use structured output.** Every AI call must return JSON that matches the schemas defined in this README. If the output format changes, update the schema in this README and in the corresponding Pydantic model.

**Test notebooks before converting them.** A notebook that works 80% of the time is not ready to become an API route. Get to 95%+ consistent output before moving to Phase 2.

**Cost awareness.** Every AI call costs money. Log token usage in notebooks with:
```python
print(f"Tokens used: {response.usage.input_tokens} in / {response.usage.output_tokens} out")
print(f"Estimated cost: ${(response.usage.input_tokens * 0.000003 + response.usage.output_tokens * 0.000015):.4f}")
# Note: update the per-token rates above when you check xAI's current pricing at x.ai/api
```

**LangSmith is your debugger.** Set `LANGCHAIN_TRACING_V2=true` in your `.env` before writing a single line of LangChain code. Every AI call will be logged to LangSmith automatically. This saves hours of debugging.

---

*Built with ❤️ to bridge the gap between education and employment.*