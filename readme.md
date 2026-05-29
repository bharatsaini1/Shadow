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
- **Phase 2** — Convert notebooks into a Django + Django REST Framework backend
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
│   │   ├── simulations/
│   │   ├── tasks/
│   │   ├── interviews/
│   │   └── payments/
│   ├── services/
│   │   ├── ai/
│   │   │   ├── simulation_engine.py
│   │   │   ├── reviewer.py
│   │   │   ├── interview_agent.py
│   │   │   ├── team_persona.py
│   │   │   └── rag_service.py
│   │   ├── storage.py
│   │   └── email_service.py
│   ├── celery_tasks/
│   ├── prompts/
│   ├── utils/
│   ├── media/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                         ← PHASE 3: Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/login/page.tsx
│   │   ├── (auth)/register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── simulation/[sessionId]/page.tsx
│   │   ├── interview/[interviewId]/page.tsx
│   │   ├── evaluation/[taskId]/page.tsx
│   │   └── passport/[userId]/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── simulation/
│   │   ├── interview/
│   │   └── evaluation/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── hooks/
│   │   └── utils.ts
│   ├── styles/globals.css
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Phase 1 — AI Pipelines (Jupyter Notebooks)

### Notebook 01 — Simulation Engine
**File:** `notebooks/01_simulation_engine.ipynb`
**AI Model:** Groq — `llama-3.3-70b-versatile`
**Key techniques:** RAG retrieval from Pinecone, JSON mode structured output, conversation memory for day continuity.

### Notebook 02 — AI Reviewer
**File:** `notebooks/02_ai_reviewer.ipynb`
**AI Model:** Groq — `llama-3.3-70b-versatile`
**Key techniques:** Evaluation rubrics injected from `data/evaluation_rubrics/`, chain-of-thought reasoning before scoring.

### Notebook 03 — Interview Agent
**File:** `notebooks/03_interview_agent.ipynb`
**AI Model:** Groq — `llama-3.1-8b-instant`

### Notebook 04 — Team Persona Engine
**File:** `notebooks/04_team_persona_engine.ipynb`
**AI Model:** Groq — `llama-3.3-70b-versatile`

### Notebook 05 — RAG Knowledge Base
**File:** `notebooks/05_rag_knowledge_base.ipynb`
**Embedding model:** `text-embedding-3-large` (OpenAI)

---

## Phase 2 — Backend (Django)

### Authentication: JWT via `djangorestframework-simplejwt`
### Database: SQLite (dev) → PostgreSQL (prod)
### Async Tasks: Celery with `CELERY_TASK_ALWAYS_EAGER=True` in dev
### File Storage: Local `media/` directory

---

## Phase 3 — Frontend (Next.js + Tailwind CSS)
### REVISED SPEC — Human-First Design Direction

---

### 🎨 Design Direction — READ THIS BEFORE WRITING ANY CODE

MentriQ Shadow is not an edtech app, not a quiz platform, not a dark-mode Coursera.

**It is a company. Students are employees. The UI is their office.**

The revised aesthetic moves away from hyper-systematized "Editorial Brutalism" and toward something that feels genuinely hand-crafted — the kind of tool a small, obsessive team of designers would build if they cared more about feel than perfection. Think: a well-worn leather notebook that became a web app. Not startup. Not corporate. Lived-in and real.

---

### The Revised Aesthetic: "Considered Craft"

**Reference**: Basecamp's restraint × Notion's warmth × a newspaper designed by someone who also makes furniture.

**What changed from the previous direction:**
- IBM Plex was competent but cold. The new font stack has grain and warmth.
- "Editorial Brutalism" produced UI that looked designed-by-committee in a dark room. We want it to look designed by a person.
- The previous color system over-indexed on dark mode and produced GenericDarkSaaS™. Now we support both modes authentically.
- Micro-animations were over-choreographed. Fewer, slower, more purposeful.

**Three new principles:**

1. **Warm restraint** — Typography carries hierarchy, but with warmth. Fraunces for display — it has ink traps and optical quirks that no AI would choose. Jakarta Sans for body — friendly but precise.

2. **Earned imperfection** — Not every line is perfectly aligned. One card in a section sits 2px lower. One heading has a slightly irregular underline. The user won't notice consciously, but they'll feel it's human.

3. **Mode-authentic** — Light mode feels like a well-lit studio. Dark mode feels like a focused late-night workspace. Neither is the "default" — both are first-class.

---

### 🖌️ Design Tokens — Complete Production Config

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class", // Toggle via class on <html>
  theme: {
    extend: {
      colors: {
        // ─── LIGHT MODE SURFACES ─────────────────────────
        // Warm whites — not pure white, not gray. Like quality paper.
        paper:        "#F9F7F4",   // page bg — warm off-white
        "paper-2":    "#F2EFE9",   // section bg — slightly deeper
        card:         "#FFFFFF",   // card surfaces — clean white
        "card-2":     "#F6F4F1",   // hover state / elevated card

        // ─── DARK MODE SURFACES ──────────────────────────
        // Near-blacks — slight warm undertone. Not pure #000.
        ink:          "#0F0E0D",   // page bg — almost-black with warmth
        "ink-2":      "#161513",   // section bg
        sheet:        "#1C1A18",   // card — lifted off ink
        "sheet-2":    "#232018",   // elevated card / hover
        "sheet-3":    "#2A2720",   // modal, dropdown, highest elevation

        // ─── BORDERS ─────────────────────────────────────
        // Light mode
        "rule-light":      "#E4E0D8",   // default border — warm gray
        "rule-light-2":    "#D0CBC1",   // stronger divider
        "rule-light-focus":"#9C8F7E",   // focused input

        // Dark mode
        rule:         "#2E2B26",   // default — warm dark
        "rule-2":     "#3A3630",   // stronger
        "rule-focus": "#6B6356",   // focused — not blue

        // ─── SEMANTIC COLORS ─────────────────────────────
        // Same meanings, slightly warmer hues
        signal:        "#2558E8",   // blue — the ONE primary CTA
        "signal-dim":  "#1D49CF",
        "signal-ghost":"rgba(37,88,232,0.07)",

        go:            "#1A9E52",   // green — success, complete, live
        "go-dim":      "#158042",
        "go-glow":     "rgba(26,158,82,0.10)",

        caution:       "#D4740A",   // amber — deadline, warning, medium
        "caution-dim": "#AE5E07",
        "caution-glow":"rgba(212,116,10,0.10)",

        stop:          "#D93030",   // red — overdue, error, danger
        "stop-dim":    "#B52525",
        "stop-glow":   "rgba(217,48,48,0.10)",

        mark:          "#7733E0",   // purple — interviews, achievements
        "mark-dim":    "#6229C2",
        "mark-glow":   "rgba(119,51,224,0.10)",

        // ─── TYPOGRAPHY — LIGHT MODE ─────────────────────
        "ink-prose":    "#1A1814",  // primary text — warm near-black
        "ink-prose-2":  "#6B6356",  // secondary — muted warm gray
        "ink-ghost":    "#A89E91",  // ghost — captions, timestamps
        "ink-dim":      "#D0C8BC",  // almost invisible — decorative

        // ─── TYPOGRAPHY — DARK MODE ──────────────────────
        prose:         "#EDEAE5",   // primary — warm white
        "prose-2":     "#9A9288",   // secondary — muted
        ghost:         "#504840",   // ghost — barely visible
        dim:           "#2A2520",   // decorative background text

        // ─── SPECIAL ─────────────────────────────────────
        scrim:         "rgba(15,14,13,0.85)",
        "scrim-light": "rgba(249,247,244,0.90)",
      },

      fontFamily: {
        // Fraunces: optical-size variable serif — has ink traps, warmth, character.
        // Not a "clean editorial font". A REAL one.
        display: ["'Fraunces'", "serif"],

        // Plus Jakarta Sans: humanist sans — friendlier than IBM Plex, less sterile
        body:    ["'Plus Jakarta Sans'", "sans-serif"],

        // Jakarta Sans Condensed for tight labels — closer to the body font family
        label:   ["'Plus Jakarta Sans'", "sans-serif"], // condensed via font-stretch

        // JetBrains Mono: the developer's choice — has ligatures, feels alive
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      fontSize: {
        "2xs": ["10px", { lineHeight: "14px", letterSpacing: "0.06em" }],
        xs:    ["11px", { lineHeight: "16px", letterSpacing: "0.03em" }],
        sm:    ["13px", { lineHeight: "20px" }],
        base:  ["14px", { lineHeight: "22px" }],
        md:    ["15px", { lineHeight: "24px" }],
        lg:    ["17px", { lineHeight: "26px" }],
        xl:    ["20px", { lineHeight: "30px" }],
        "2xl": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em" }],
        "3xl": ["30px", { lineHeight: "37px", letterSpacing: "-0.015em" }],
        "4xl": ["38px", { lineHeight: "44px", letterSpacing: "-0.02em" }],
        "5xl": ["50px", { lineHeight: "56px", letterSpacing: "-0.025em" }],
        "6xl": ["64px", { lineHeight: "70px", letterSpacing: "-0.03em" }],
        "7xl": ["82px", { lineHeight: "86px", letterSpacing: "-0.04em" }],
      },

      spacing: {
        sidebar:             "260px",
        "sidebar-collapsed": "52px",
        topbar:              "52px",
        panel:               "316px",
        chat:                "276px",
      },

      borderRadius: {
        none:   "0px",
        sm:     "3px",
        base:   "5px",
        md:     "8px",
        lg:     "12px",
        xl:     "18px",
        pill:   "999px",
        // Prefer base (5px) and md (8px).
        // Note: 5px instead of 6px — slightly tighter, less "rounded-corner-kit"
      },

      boxShadow: {
        // Warm-toned shadows — not pure black
        lift:   "0 1px 3px rgba(15,14,13,0.12), 0 0 0 1px rgba(15,14,13,0.04)",
        float:  "0 4px 16px rgba(15,14,13,0.15), 0 0 0 1px rgba(15,14,13,0.05)",
        deep:   "0 8px 32px rgba(15,14,13,0.22), 0 0 0 1px rgba(15,14,13,0.06)",

        // Light mode versions
        "lift-light":  "0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "float-light": "0 4px 12px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",

        // Focus ring — warm, not pure blue
        "focus-ring":  "0 0 0 2px rgba(37,88,232,0.35)",
      },

      animation: {
        // Entry — slightly slower than before, feels more considered
        "enter-up":    "enterUp 0.40s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-down":  "enterDown 0.40s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-left":  "enterLeft 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "enter-right": "enterRight 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade":        "fade 0.30s ease both",

        // State
        "pulse-slow":  "pulse 3.5s ease-in-out infinite",
        "blink":       "blink 1.2s step-start infinite",

        // Score / progress
        "bar-fill":    "barFill 1.0s cubic-bezier(0.22, 1, 0.36, 1) both",
        "ring-draw":   "ringDraw 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
        "count-up":    "fade 0.09s ease both",
        "xp-rise":     "xpRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",

        // Feedback
        "shake":       "shake 0.32s ease both",
        "shimmer":     "shimmer 1.8s linear infinite",

        // Chat
        "msg-in":      "msgIn 0.22s ease both",
        "dot-1":       "dotPulse 1.3s 0ms ease-in-out infinite",
        "dot-2":       "dotPulse 1.3s 200ms ease-in-out infinite",
        "dot-3":       "dotPulse 1.3s 400ms ease-in-out infinite",
      },

      keyframes: {
        enterUp:    { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        enterDown:  { "0%": { opacity: "0", transform: "translateY(-14px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        enterLeft:  { "0%": { opacity: "0", transform: "translateX(18px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        enterRight: { "0%": { opacity: "0", transform: "translateX(-18px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        fade:       { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        blink:      { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0" } },
        barFill:    { "0%": { width: "0%" }, "100%": { width: "var(--bar-w)" } },
        ringDraw:   { "0%": { strokeDashoffset: "var(--ring-full)" }, "100%": { strokeDashoffset: "var(--ring-offset)" } },
        xpRise:     { "0%": { opacity: "0", transform: "translateY(10px) scale(0.85)" }, "60%": { transform: "translateY(-3px) scale(1.04)" }, "100%": { opacity: "1", transform: "translateY(0) scale(1)" } },
        shake:      { "0%, 100%": { transform: "translateX(0)" }, "20%": { transform: "translateX(-6px)" }, "60%": { transform: "translateX(5px)" } },
        shimmer:    { "0%": { backgroundPosition: "-600px 0" }, "100%": { backgroundPosition: "600px 0" } },
        msgIn:      { "0%": { opacity: "0", transform: "translateY(7px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        dotPulse:   { "0%, 80%, 100%": { transform: "scale(0.55)", opacity: "0.35" }, "40%": { transform: "scale(1)", opacity: "1" } },
      },
    },
  },
  plugins: [],
};
export default config;
```

---

### 📦 Dependencies

```bash
# Core
npm install axios clsx tailwind-merge

# Animation
npm install framer-motion

# Editor (ALWAYS use dynamic import — never static)
npm install monaco-editor @monaco-editor/react

# Confetti (score celebration — use sparingly)
npm install canvas-confetti
npm install -D @types/canvas-confetti

# Icons — Lucide is clean and matches the direction
npm install lucide-react

# Date
npm install date-fns

# Fonts — loaded via next/font:
# Fraunces (variable, supports optical size axis — use opsz)
# Plus Jakarta Sans
# JetBrains Mono
```

---

### Font Setup — `app/layout.tsx`

```typescript
import {
  Fraunces,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";

// Fraunces: variable weight (100–900) and optical size (9–144)
// The "9" optical size has more ink trap character — ideal for display
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "wght", "SOFT", "WONK"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`
        ${fraunces.variable}
        ${plusJakartaSans.variable}
        ${jetbrainsMono.variable}
      `}
      // No class here — JS in ThemeProvider adds 'dark' or 'light'
    >
      <body className="bg-paper dark:bg-ink font-body text-ink-prose dark:text-prose antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

### Theme Provider — `components/ThemeProvider.tsx`

```typescript
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (t: Theme) => void;
}>({ theme: "system", resolvedTheme: "dark", setTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolved] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ms_theme") as Theme | null;
    if (saved) setThemeState(saved);
  }, []);

  useEffect(() => {
    const applyTheme = (t: Theme) => {
      const html = document.documentElement;
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        html.classList.toggle("dark", prefersDark);
        setResolved(prefersDark ? "dark" : "light");
      } else {
        html.classList.toggle("dark", t === "dark");
        setResolved(t);
      }
    };
    applyTheme(theme);
    localStorage.setItem("ms_theme", theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Theme Toggle Component — `components/ui/ThemeToggle.tsx`

```typescript
"use client";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ variant = "icon" }: { variant?: "icon" | "segmented" }) {
  const { theme, setTheme } = useTheme();

  if (variant === "icon") {
    // Cycles: light → dark → system
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
    return (
      <button
        onClick={() => setTheme(next)}
        className="btn-icon"
        title={`Current: ${theme} — click to switch`}
        aria-label="Toggle theme"
      >
        <Icon size={15} />
      </button>
    );
  }

  // Segmented control variant (for Settings page)
  const options: { value: typeof theme; icon: typeof Sun; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="inline-flex bg-paper-2 dark:bg-sheet rounded-md p-0.5 border border-rule-light dark:border-rule">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body font-medium transition-all duration-150",
            theme === value
              ? "bg-white dark:bg-sheet-2 text-ink-prose dark:text-prose shadow-lift-light dark:shadow-lift"
              : "text-ink-ghost dark:text-ghost hover:text-ink-prose-2 dark:hover:text-prose-2"
          )}
          aria-pressed={theme === value}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}
```

---

### 🧩 Global CSS — `styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --sidebar-w:        260px;
    --sidebar-w-sm:     52px;
    --topbar-h:         52px;
    --chat-w:           276px;
    --panel-w:          316px;
    --ease-out-expo:    cubic-bezier(0.22, 1, 0.36, 1);
    --ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1);
    --t-fast:           120ms;
    --t-base:           220ms;
    --t-slow:           380ms;
  }

  /* Scrollbar — barely there */
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: #E4E0D8;
    border-radius: 999px;
  }
  .dark ::-webkit-scrollbar-thumb { background: #2E2B26; }
  ::-webkit-scrollbar-thumb:hover { background: #D0CBC1; }
  .dark ::-webkit-scrollbar-thumb:hover { background: #3A3630; }

  /* Selection */
  ::selection {
    background: rgba(37,88,232,0.12);
    color: #1A1814;
  }
  .dark ::selection {
    background: rgba(255,255,255,0.10);
    color: #EDEAE5;
  }

  /* Focus — keyboard nav only */
  :focus-visible {
    outline: 2px solid rgba(37,88,232,0.45);
    outline-offset: 2px;
    border-radius: 4px;
  }
  :focus:not(:focus-visible) { outline: none; }

  /* Fraunces display tweaks */
  .font-display {
    font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
    font-optical-sizing: auto;
  }

  /* JetBrains Mono ligatures */
  .font-mono {
    font-feature-settings: "liga" 1, "calt" 1, "zero" 1;
  }
}

@layer components {

  /* ── SKELETON LOADER ──────────────────────────────── */
  .skeleton {
    background: linear-gradient(
      90deg,
      #F2EFE9 25%,
      #E8E4DC 50%,
      #F2EFE9 75%
    );
    background-size: 600px 100%;
    animation: shimmer 1.8s linear infinite;
    border-radius: 4px;
  }
  .dark .skeleton {
    background: linear-gradient(
      90deg,
      #1C1A18 25%,
      #232018 50%,
      #1C1A18 75%
    );
    background-size: 600px 100%;
  }

  /* ── GRAPH BACKGROUND ─────────────────────────────── */
  .graph-bg {
    background-image:
      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .dark .graph-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── CARD SYSTEM ──────────────────────────────────── */
  .card {
    @apply bg-card dark:bg-sheet border border-rule-light dark:border-rule rounded-md shadow-lift-light dark:shadow-lift;
  }

  .card-action {
    @apply card transition-all duration-200 cursor-pointer;
    @apply hover:border-rule-light-2 dark:hover:border-rule-2 hover:bg-card-2 dark:hover:bg-sheet-2 hover:-translate-y-px;
    @apply active:translate-y-0 active:shadow-none;
  }

  /* ── BADGE SYSTEM ─────────────────────────────────── */
  .badge {
    @apply inline-flex items-center gap-1 font-label text-2xs font-medium
           uppercase tracking-wider px-1.5 py-0.5 rounded-sm;
    font-stretch: condensed;
    letter-spacing: 0.06em;
  }

  .badge-live      { @apply badge bg-go/10 text-go border border-go/20; }
  .badge-active    { @apply badge bg-signal/10 text-signal border border-signal/20; }
  .badge-paused    { @apply badge bg-caution/10 text-caution border border-caution/20; }
  .badge-done      { @apply badge bg-go/10 text-go border border-go/20; }
  .badge-overdue   { @apply badge bg-stop/10 text-stop border border-stop/20; }
  .badge-hard      { @apply badge bg-stop/10 text-stop border border-stop/20; }
  .badge-medium    { @apply badge bg-caution/10 text-caution border border-caution/20; }
  .badge-easy      { @apply badge bg-go/10 text-go border border-go/20; }
  .badge-interview { @apply badge bg-mark/10 text-mark border border-mark/20; }
  .badge-neutral   { @apply badge bg-paper-2 dark:bg-sheet-2 text-ink-prose-2 dark:text-prose-2 border border-rule-light dark:border-rule; }
  .badge-plan      { @apply badge bg-signal/10 text-signal border border-signal/20; }

  /* ── BUTTON SYSTEM ────────────────────────────────── */
  .btn {
    @apply inline-flex items-center justify-center gap-2 font-body font-medium
           text-sm transition-all duration-150 select-none cursor-pointer;
    @apply active:scale-[0.97];
  }

  /* Primary — used ONCE per screen. The one action that matters. */
  .btn-primary {
    @apply btn px-4 py-2 bg-signal hover:bg-signal-dim text-white rounded-md;
    box-shadow: 0 1px 2px rgba(37,88,232,0.25), 0 0 0 1px rgba(37,88,232,0.15);
  }
  .btn-primary:hover {
    box-shadow: 0 2px 8px rgba(37,88,232,0.30), 0 0 0 1px rgba(37,88,232,0.20);
  }

  /* Secondary — supporting actions */
  .btn-secondary {
    @apply btn px-4 py-2 bg-card dark:bg-sheet-2 hover:bg-card-2 dark:hover:bg-sheet-3 
           text-ink-prose dark:text-prose border border-rule-light dark:border-rule 
           hover:border-rule-light-2 dark:hover:border-rule-2 rounded-md;
  }

  /* Ghost — low-emphasis */
  .btn-ghost {
    @apply btn px-3 py-1.5 text-ink-prose-2 dark:text-prose-2 
           hover:text-ink-prose dark:hover:text-prose 
           hover:bg-paper-2 dark:hover:bg-sheet-2 rounded-base;
  }

  /* Danger */
  .btn-danger {
    @apply btn px-4 py-2 bg-stop/8 hover:bg-stop/15 text-stop
           border border-stop/20 rounded-md;
  }

  /* Icon button */
  .btn-icon {
    @apply btn p-1.5 text-ink-ghost dark:text-ghost 
           hover:text-ink-prose-2 dark:hover:text-prose-2 
           hover:bg-paper-2 dark:hover:bg-sheet-2 rounded-base;
  }

  /* ── INPUT SYSTEM ─────────────────────────────────── */
  .input {
    @apply w-full bg-card dark:bg-sheet border border-rule-light dark:border-rule rounded-md
           text-sm text-ink-prose dark:text-prose placeholder:text-ink-ghost dark:placeholder:text-ghost
           px-3 py-2 transition-all duration-150;
    @apply hover:border-rule-light-2 dark:hover:border-rule-2;
    @apply focus:outline-none focus:border-rule-light-focus dark:focus:border-rule-focus;
  }

  .input-error {
    @apply input border-stop/40 focus:border-stop/60 dark:border-stop/40 dark:focus:border-stop/60;
  }

  /* ── DIVIDERS ─────────────────────────────────────── */
  .divider {
    @apply border-t border-rule-light dark:border-rule;
  }

  .divider-label {
    @apply flex items-center gap-3 text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest;
  }
  .divider-label::before,
  .divider-label::after {
    content: '';
    @apply flex-1 border-t border-rule-light dark:border-rule;
  }

  /* ── PERSONA AVATARS ──────────────────────────────── */
  .avatar {
    @apply flex items-center justify-center rounded-full
           font-body font-medium text-sm select-none shrink-0;
  }

  /* Slightly warmer palette — feels more human */
  .av-priya  { background: #1A4EC7; color: #C8D9FA; }
  .av-karan  { background: #1A7A42; color: #B8EDD2; }
  .av-sneha  { background: #A85A0A; color: #FAE0B0; }
  .av-mehta  { background: #6628C8; color: #DDD0FA; }
  .av-meera  { background: #0A7085; color: #ACECF7; }

  /* ── DEADLINE TIMER ───────────────────────────────── */
  .timer         { @apply font-mono text-sm tabular-nums; }
  .timer-safe    { @apply timer text-ink-prose-2 dark:text-prose-2; }
  .timer-caution { @apply timer text-caution; }
  .timer-danger  { @apply timer text-stop animate-pulse; }
  .timer-overdue { @apply timer text-stop font-semibold; }

  /* ── ONLINE INDICATORS ────────────────────────────── */
  .dot-online  { @apply w-1.5 h-1.5 rounded-full bg-go shrink-0; }
  .dot-away    { @apply w-1.5 h-1.5 rounded-full bg-caution shrink-0; }
  .dot-offline { @apply w-1.5 h-1.5 rounded-full bg-ink-ghost dark:bg-ghost shrink-0; }

  /* ── STAT CARD ────────────────────────────────────── */
  .stat-card  { @apply card p-4 flex flex-col gap-1; }
  .stat-label { @apply font-label text-2xs text-ink-ghost dark:text-ghost uppercase tracking-wider; font-stretch: condensed; }
  .stat-value {
    @apply font-display text-3xl text-ink-prose dark:text-prose leading-none;
    font-variation-settings: "opsz" 36, "wght" 600;
    /* Fraunces at large optical size — maximum ink trap character */
  }
  .stat-sub   { @apply font-mono text-xs text-ink-prose-2 dark:text-prose-2; }

  /* ── SECTION HEADER ───────────────────────────────── */
  .section-header { @apply flex items-center justify-between mb-3; }
  .section-title  {
    @apply font-body text-xs font-semibold text-ink-prose-2 dark:text-prose-2 
           uppercase tracking-wider;
    letter-spacing: 0.07em;
  }

  /* ── CODE BLOCK ───────────────────────────────────── */
  .code-block {
    @apply bg-paper-2 dark:bg-ink border border-rule-light dark:border-rule 
           rounded-md font-mono text-sm text-ink-prose-2 dark:text-prose-2 p-4 overflow-x-auto;
  }

  /* ── TASK TYPE TAG ────────────────────────────────── */
  .task-type {
    @apply font-mono text-2xs text-ink-ghost dark:text-ghost 
           border border-rule-light dark:border-rule px-1.5 py-0.5 rounded-sm;
  }

  /* ── DISPLAY HEADING ─────────────────────────────── */
  /* Fraunces with optical size tuning for headings */
  .heading-display {
    font-family: var(--font-display);
    font-variation-settings: "opsz" 18, "wght" 700;
    letter-spacing: -0.02em;
  }
  .heading-display-sm {
    font-family: var(--font-display);
    font-variation-settings: "opsz" 14, "wght" 600;
    letter-spacing: -0.01em;
  }

  /* ── LINK UNDERLINE ──────────────────────────────── */
  /* Hand-crafted underline — slightly off-baseline, warm color */
  .link-warm {
    @apply text-signal underline-offset-[3px] decoration-signal/40;
    text-decoration-thickness: 1px;
    transition: text-decoration-color 150ms ease;
  }
  .link-warm:hover {
    @apply decoration-signal;
  }
}

/* ── ANIMATION DELAY UTILITIES ────────────────────── */
.delay-50  { animation-delay: 50ms; }
.delay-100 { animation-delay: 100ms; }
.delay-150 { animation-delay: 150ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.delay-600 { animation-delay: 600ms; }
.delay-700 { animation-delay: 700ms; }

/* ── SCROLL ANIMATIONS ────────────────────────────── */
.animate-section {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.animate-section.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 🤖 REVISED PROMPTS FOR EVERY SCREEN

> **HOW TO USE THESE PROMPTS**
>
> These are revised versions that eliminate AI-generated aesthetics and enforce the new "Considered Craft" direction.
>
> **Critical rules before you start:**
> 1. Configure `tailwind.config.ts` and `globals.css` from above FIRST.
> 2. Install all dependencies including the new fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono).
> 3. Set up `ThemeProvider` in `app/layout.tsx` before any UI work.
> 4. The backend API, models, and routes must NOT change.

---

### PROMPT 1 — Root Layout + Navigation Shell

**Files:** `app/layout.tsx`, `components/ThemeProvider.tsx`, `components/layout/Sidebar.tsx`, `components/layout/Topbar.tsx`

```
You are building the navigation shell for MentriQ Shadow — an AI career simulation platform.

DESIGN DIRECTION: "Considered Craft" — looks made by a human designer, not generated by AI.
Warm off-whites in light mode. Near-black with warmth in dark mode. Both modes are first-class.
Think Basecamp's restraint × Notion's warmth. NOT generic dark SaaS. NOT gradient-heavy startup.

TECH: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
THEME: Full dark/light mode support via 'dark' class on <html>. ThemeProvider handles this.

FONTS (via CSS variables):
- --font-display: Fraunces (variable — use font-variation-settings for optical sizing)
  Display headings: font-variation-settings: "opsz" 18, "wght" 700
  Large numbers: font-variation-settings: "opsz" 36, "wght" 600
- --font-body: Plus Jakarta Sans (all UI text, labels, buttons)
- --font-mono: JetBrains Mono (code, IDs, timestamps, timers — has ligatures)
Tailwind classes: font-display, font-body, font-mono

DESIGN TOKENS (in tailwind.config.ts — already configured):
LIGHT MODE: bg paper (#F9F7F4), card (#FFFFFF), card-2 (#F6F4F1), borders rule-light (#E4E0D8)
DARK MODE: bg ink (#0F0E0D), sheet (#1C1A18), sheet-2 (#232018), borders rule (#2E2B26)
PRIMARY: signal (#2558E8) — used ONCE per screen on the main CTA, nowhere else
SUCCESS: go, WARN: caution, ERROR: stop, SPECIAL: mark
LIGHT TEXT: ink-prose (#1A1814), ink-prose-2 (#6B6356), ink-ghost (#A89E91)
DARK TEXT: prose (#EDEAE5), prose-2 (#9A9288), ghost (#504840)

CUSTOM CLASSES: card, card-action, badge-*, btn-primary/secondary/ghost/danger/icon, 
input, input-error, avatar, av-priya/karan/sneha/mehta/meera, dot-online/away/offline, 
stat-card/label/value/sub, section-header/title, skeleton, graph-bg, divider, divider-label, 
timer, timer-safe/caution/danger/overdue, task-type, heading-display, link-warm

BUILD `components/layout/Sidebar.tsx`:
- "use client"
- Fixed left side, full height, width: 260px (collapsed: 52px)
- LIGHT: bg-paper border-r border-rule-light
- DARK: bg-ink border-r border-rule
- The sidebar should NOT feel like a separated panel — it's part of the page, separated by a hairline

LOGO AREA (52px height, border-b border-rule-light dark:border-rule):
  - Collapsed: A 24×24 warm-tinted square with "MS" in signal color, centered
    The square has a slight warm fill (bg-signal/10 in light, bg-signal/15 in dark)
    NOT a full signal-blue square — just a tint
  - Expanded: Same square + "MentriQ Shadow" in font-body font-semibold text-sm
    light: text-ink-prose / dark: text-prose
  - Collapse toggle: ChevronLeft btn-icon at far right of logo area
    Rotates 180° when collapsed

NAV SECTION LABEL (expanded only):
  font-mono text-2xs text-ink-ghost dark:text-ghost uppercase tracking-widest px-3 mb-1
  (monospaced for section labels — subtle detail that feels designed)

NAV ITEMS (routes, icons from lucide-react):
  - "Workspace" → LayoutGrid → /dashboard
  - "Simulations" → Play → /simulation
  - "Interviews" → MessageSquare → /interview
  - "My Passport" → FileText → /passport/me
  - "Leaderboard" → BarChart2 → /leaderboard

  NAV ITEM STYLING:
  - Height: 36px, px-3, flex items-center gap-2.5, rounded-base, cursor-pointer
  - LIGHT default: text-ink-ghost hover:text-ink-prose hover:bg-paper-2
  - DARK default: text-ghost hover:text-prose-2 hover:bg-sheet
  - ACTIVE LIGHT: text-ink-prose bg-card border-l-2 border-signal shadow-lift-light
  - ACTIVE DARK: text-prose bg-sheet-2 border-l-2 border-signal
  - Collapsed: icon only, centered (tooltip on hover)
  - Icon: w-4 h-4 (16px), never larger

  Section divider: border-t border-rule-light dark:border-rule mx-3 my-2

BOTTOM SECTION:
  USER ROW (expanded):
  - 28px avatar (av-priya for demo user)
  - Name: text-sm font-medium light:text-ink-prose dark:text-prose truncated
  - Plan badge below name (badge-plan or badge-neutral)
  - Settings icon (Cog, btn-icon) right-aligned
  - ThemeToggle component (icon variant) — placed right of settings icon

  USER ROW (collapsed):
  - Just the 28px avatar, centered, tooltip with name + theme toggle in tooltip

FRAMER MOTION:
  - Width: spring({ stiffness: 280, damping: 28 }) — slightly softer spring than before
  - Text reveal: opacity 0→1, x -6→0 (gentler than before)
  - State: localStorage key "ms_sidebar_open"

MOBILE (<768px):
  - Drawer from left, same styling as desktop
  - Overlay: bg-scrim dark:bg-scrim z-40 (or bg-scrim-light/bg-scrim depending on mode)
  - Sheet: z-50

---

BUILD `components/layout/Topbar.tsx`:
- "use client"
- Fixed top, 52px, backdrop-blur-md
- LIGHT: bg-paper/92 border-b border-rule-light
- DARK: bg-ink/92 border-b border-rule

LEFT:
  - Mobile: Menu btn-icon
  - Page title from usePathname() — font-body text-sm font-medium 
    light:text-ink-prose-2 dark:text-prose-2

CENTER:
  - Search input (hidden mobile): width 240px→320px on focus, input class
    placeholder "Search or jump to..." 
    Leading: Search icon (13px)
    Trailing: kbd element — font-mono text-2xs text-ink-ghost dark:text-ghost "⌘K"
    Focus: expand width + open command palette

RIGHT:
  - Active session chip (if active sim):
    dot-online + font-mono text-xs dark:text-prose-2 light:text-ink-prose-2 "Day 3 · MERN Dev"
    border: light border-rule-light bg-card / dark border-rule bg-sheet-2
    rounded-md px-2 py-1
  
  - ThemeToggle (icon variant) — this is where users discover the theme toggle in topbar

  - Notifications: Bell btn-icon + 6px stop-colored dot badge

  - User avatar: 28px, av-priya, dropdown on click:
    "View Passport" / "Settings" / "Sign Out" (text-stop)

COMMAND PALETTE:
  - Overlay: fixed inset-0, bg-scrim z-50, fade in
  - Panel: fixed top-16 left-1/2 -translate-x-1/2, w-[480px]
    LIGHT: bg-card border border-rule-light shadow-float-light
    DARK: bg-sheet-2 border border-rule shadow-deep
    rounded-xl (slightly more rounded than before — feels approachable)
  - Search input top, no border
  - Sections: section-title labels
  - 36px rows with icon + label + shortcut
  - Arrow keys + Enter + Esc

IMPORTANT:
- No <form> tags — onClick/onChange only
- All conditional classes via cn() from clsx+tailwind-merge
- No hardcoded hex — use Tailwind token classes
- Both light and dark variants for every element
- Export: Sidebar as default, Topbar as default
```

---

### PROMPT 2 — Landing Page

**File:** `app/page.tsx`

```
Build the landing page for MentriQ Shadow.

CRITICAL ANTI-AI-DESIGN RULES — every typical AI landing page pattern must be deliberately avoided:
- No hero with a gradient blob or mesh gradient background
- No three-feature cards with icons in a row
- No rounded-pill hero buttons placed side by side
- No "Join 10,000+ students" floating avatar circles
- No glassmorphism / frosted cards
- No purple/teal gradient brand colors
- No AI-generated hero illustration
- No "Built for [X], [Y], [Z]" persona section

Instead: think of a well-designed print newspaper's digital edition. Measured, typographically-driven, made by someone who has taste. The page changes mood between light/dark mode — light mode feels like morning newspaper, dark mode feels like reading late at night.

TECH: Next.js 14, TypeScript, Tailwind CSS (Framer Motion for hero only — CSS transitions elsewhere)
THEME: Full light/dark mode support. Light is the default. Both look intentionally designed.

LAYOUT PRINCIPLES:
- Strict 12-column CSS grid for major sections (grid-cols-12)
- Asymmetric sections — alternate left-heavy and right-heavy
- Hero: 100vh exactly
- Section gaps: py-24 to py-32
- Horizontal rules (border-rule-light dark:border-rule) between sections

────────────────────────────────────────
NAV (public)
────────────────────────────────────────
Fixed top, 52px
LIGHT: bg-paper/90 backdrop-blur-md border-b border-rule-light
DARK: bg-ink/90 backdrop-blur-md border-b border-rule

LEFT: "MS" warm-tinted logo square + "MentriQ Shadow" font-body font-semibold text-sm
RIGHT: ThemeToggle (segmented variant — shows Light/Dark/System) + "Sign In" btn-ghost + "Get started" btn-primary

Mobile: hamburger → full-screen overlay nav

────────────────────────────────────────
HERO — Full viewport
────────────────────────────────────────
Background: graph-bg class (subtle warm grid in light, cool near-invisible in dark)

Layout: asymmetric 7/5 split (col-span-7 left, col-span-5 right)

LEFT:
- EYEBROW: font-mono text-xs text-ink-ghost dark:text-ghost
  "v1.0 — MERN Stack Track Now Live"
  (monospaced, no badge, just a line of quiet context)

- HEADLINE (Fraunces variable, large optical size):
  font-display text-[76px] leading-none tracking-tight
  light: text-ink-prose / dark: text-prose
  font-variation-settings: "opsz" 72, "wght" 700
  
  "Get the job.
  Do it first."
  
  "first" — italic (font-style: italic, font-variation-settings keeps size/weight, add style)
  This is the ONE typographic flourish. No gradients, no highlights.

- SUBHEADLINE: Plus Jakarta Sans, 17px, mt-6
  light: text-ink-prose-2 / dark: text-prose-2
  max-width 440px, leading-relaxed
  "MentriQ Shadow puts you inside a real company. Complete AI-assigned tasks, get reviewed, practice interviews — before your first job."

- CTA ROW (flex gap-4, mt-10):
  btn-primary "Apply for free simulation →"
  A plain link (no button styling): link-warm class + "See how it works" 
  (The contrast between a real button and a plain link is more human than two styled buttons)

- PROOF LINE (mt-6):
  font-mono text-xs text-ink-ghost dark:text-ghost
  "2,400 students · 14 career tracks · avg. score 71/100"

RIGHT — SIMULATED WORK CARD:
  A card that looks like an actual internal tool, not a polished mockup.
  card class, shadow-float-light dark:shadow-float
  
  TOP BAR (bg-paper-2 dark:bg-sheet-2, border-b border-rule-light dark:border-rule, px-4 py-2.5):
    Left: font-mono text-xs text-ink-ghost dark:text-ghost "task_019 · MERN · Day 3"
    Right: badge-hard "HARD"
  
  BODY (px-4 py-4):
    Title: font-body text-base font-semibold light:text-ink-prose dark:text-prose
    "Fix the JWT refresh token vulnerability"
    
    Deadline row: Clock icon 12px + timer-danger "01:47:22 remaining"
    
    Assigned by: 20px av-priya + "Priya · Team Lead" font-body text-xs light:text-ink-prose-2 dark:text-prose-2
    
    Manager note (border-l-2 border-rule-light dark:border-rule, pl-3, font-body text-sm light:text-ink-ghost dark:text-ghost italic):
    "The client flagged this in the standup. Priority alpha — fix before EOD."
  
  BOTTOM (bg-paper-2 dark:bg-sheet-2, border-t, px-4 py-2.5, flex justify-between items-center):
    Left: font-mono text-xs light:text-ink-ghost dark:text-ghost "40% reviewed"
    Right: progress bar 80px wide, h-px (1px), bg-rule-light dark:bg-rule, fill 40% go color

────────────────────────────────────────
SECTION: THE PARADOX
────────────────────────────────────────
max-w-4xl, mx-auto

Large background number (col-span-3): 
  font-display text-7xl light:text-ink-dim dark:text-dim "95%"
  font-variation-settings: "opsz" 72, "wght" 400 (lighter weight for background feel)

Next to it (col-span-9):
  font-display text-4xl light:text-ink-prose dark:text-prose
  font-variation-settings: "opsz" 36, "wght" 600
  "of freshers get rejected before they get a chance."
  
  Body: font-body text-base light:text-ink-prose-2 dark:text-prose-2 mt-4 max-w-xl leading-relaxed

────────────────────────────────────────
SECTION: THE CONTRAST
────────────────────────────────────────
Single card (card class) split by a vertical rule:

LEFT ("The old way"):
  section-title "The old way" (text-ink-ghost or ghost)
  4 items with X icon (stop color, 14px) + text-sm line-through light:text-ink-ghost dark:text-ghost:
  ✗ Watch lecture → take quiz
  ✗ Get certificate of completion
  ✗ Apply with 0 experience
  ✗ Get auto-rejected

RIGHT ("MentriQ Shadow"):
  section-title in text-go "MentriQ Shadow"
  4 items with Check icon (go, 14px) + text-sm light:text-ink-prose dark:text-prose:
  ✓ Work a real task → get AI-reviewed
  ✓ Earn a verifiable Shadow Passport
  ✓ Apply with documented performance data
  ✓ Get noticed

────────────────────────────────────────
SECTION: HOW IT WORKS
────────────────────────────────────────
"Three steps. Real work." — Fraunces, section heading

NOT numbered cards. A left timeline rail (border-l-2 border-rule-light dark:border-rule):
Each step:
  - Timeline dot: w-2 h-2, light: bg-signal / dark: bg-signal rounded-full
  - Step number: font-mono text-xs text-ink-ghost dark:text-ghost "01 —"
  - Title: font-body text-base font-semibold light:text-ink-prose dark:text-prose
  - Description: font-body text-sm light:text-ink-prose-2 dark:text-prose-2 leading-relaxed

────────────────────────────────────────
SECTION: CAREER TRACKS
────────────────────────────────────────
Bordered container (border border-rule-light dark:border-rule rounded-md overflow-hidden):
Each row (border-b border-rule-light dark:border-rule last:border-0, px-5 py-3.5, flex justify-between):
  LEFT: Track name (font-body text-sm font-medium) + description (text-xs ghost)
  RIGHT: Status badge

Rows:
  MERN Stack Developer → badge-live "LIVE"
  Data Analyst → badge-live "LIVE"
  UI/UX Designer → badge-neutral "V2"
  Frontend Developer → badge-neutral "V2"
  Backend Developer → badge-neutral "V3"
  HR Executive → badge-neutral "V3"

────────────────────────────────────────
SECTION: PRICING
────────────────────────────────────────
Monthly/Yearly toggle: segmented control, font-mono text-xs

THREE COLUMNS — middle card is the recommended one:
  Apply slightly more padding (py-8 vs py-6) to middle card
  Middle card: top accent bar (h-0.5 bg-signal)

PLAN 1 — Free (₹0): card p-6
PLAN 2 — Student Pro (₹299): card + border-signal/30 + top accent + badge-active "Popular"
PLAN 3 — Student Elite (₹599): card p-6

Features with Check icon (go, 14px).
CTAs: secondary/primary/secondary respectively.

COLLEGE PLAN: border card below, flex justify-between
  Left: "College License" + description ghost
  Right: price in font-mono + "Contact us →" link-warm

────────────────────────────────────────
FOOTER
────────────────────────────────────────
LIGHT: bg-paper-2 border-t border-rule-light
DARK: bg-sheet border-t border-rule

4-column grid, py-12
Bottom bar: font-mono text-xs ghost, flex justify-between
Left: "© 2025 MentriQ Shadow"  Right: "Built for India's next generation of developers"

SCROLL ANIMATIONS: IntersectionObserver + animate-section + in-view CSS classes (no Framer Motion)

NOTE ON LIGHT MODE HERO:
The hero in light mode should feel like opening a newspaper to a full-page ad.
The graph-bg provides subtle paper texture.
The large Fraunces headline at full optical size looks like it was SET in type, not generated.
```

---

### PROMPT 3 — Login & Register

**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`

```
Build Login and Register pages for MentriQ Shadow.

THEME: Full light/dark mode. Light mode: warm off-white bg. Dark mode: near-black.
DESIGN: Centered form. Simple. Not split-screen. Not a branded left panel.
FONTS: font-display (Fraunces), font-body (Plus Jakarta Sans), font-mono (JetBrains Mono)

LAYOUT: Centered vertically, max-w-sm, mx-auto, pt-24 pb-16

BUILD `app/(auth)/login/page.tsx`:

PAGE BG: light bg-paper / dark bg-ink (full page)

PAGE TOP (mb-8):
  Logo ("MS" tinted square + "MentriQ Shadow") — linked to /
  Below: font-mono text-xs light:text-ink-ghost dark:text-ghost
  "Step 1 of 1 — Sign in to your workspace"

  ThemeToggle (segmented variant, centered, mt-4) — users should be able to switch mode on auth page

FORM CARD (card class, p-8):
  Heading: font-display text-3xl light:text-ink-prose dark:text-prose
  font-variation-settings: "opsz" 30, "wght" 700
  "Welcome back."
  
  Sub: font-body text-sm light:text-ink-ghost dark:text-ghost mt-1
  "Your team is waiting."

  Email field:
    Label: font-mono text-xs light:text-ink-ghost dark:text-ghost uppercase tracking-wider "email address"
    (monospaced labels on auth forms — a small distinctive choice)
    Input: input class

  Password field:
    Same label style "password"
    Input with Eye/EyeOff toggle (btn-icon inside right)
    "Forgot password?" — link-warm text-xs, right-aligned

  Error state:
    AlertCircle (12px, text-stop) + font-mono text-xs text-stop "Invalid email or password"
    Inputs get input-error class + animate-shake once

  Submit: btn-primary full-width "Sign in →"
  Loading: Loader2 animate-spin in place of arrow text

  Divider: divider-label "or"

  Google OAuth: btn-secondary full-width
    Google SVG (22×22, inline) + "Continue with Google"

BELOW CARD:
  font-body text-sm light:text-ink-ghost dark:text-ghost text-center
  "No account? " + link-warm "Start your simulation →"

MOTION: Form card enters with animate-enter-up delay-100. Nothing else.

---

BUILD `app/(auth)/register/page.tsx`:

Same layout. ThemeToggle visible.

Heading: "Join the simulation."
Sub: "Takes 60 seconds. Free to start."

FIELDS:
1. Full Name — font-mono label "your name"
2. Email — font-mono label "email address"
3. Password — font-mono label "choose password"
   PASSWORD STRENGTH: 5 small squares (4×16px, gap-0.5):
   Empty: bg-rule-light dark:bg-rule
   1/5: bg-stop / 2-3/5: bg-caution / 4-5/5: bg-go

4. Career Track — styled native select:
   font-mono label "i want to simulate..."
   <select> with input class (both light/dark variants work via input class)

SUBMIT: btn-primary "Create workspace →"
SUCCESS STATE: AnimatePresence card swap:
  CheckCircle (32px, go) + "Workspace created." (font-display) + "Redirecting..." (font-mono ghost)
  router.push('/dashboard') after 1.5s

VALIDATION: client-side, blur-triggered, font-mono text-xs text-stop below fields

IMPORTANT: No <form> tags. useState only. Framer Motion: success swap + card entry only.
```

---

### PROMPT 4 — Student Dashboard

**Files:** `app/dashboard/page.tsx`, `components/dashboard/*.tsx`

```
Build the Student Dashboard for MentriQ Shadow.

DESIGN: "Walked into the office and found work waiting." NOT a learning dashboard.
HIERARCHY: Work first. What do I need to do TODAY? Then context. Then performance.
THEME: Full light/dark. Light mode feels like a well-lit workday. Dark mode is focused.

TECH: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React.

LAYOUT: ml-[260px] pt-[52px] — main content area only (sidebar + topbar are separate)
Content: max-w-6xl mx-auto px-8 py-8
Grid: grid-cols-12, gap-6

─────────────────────────────────────
COMPONENT: DashboardGreeting
─────────────────────────────────────
col-span-12, mb-2. No card — just text.

Left: font-display text-2xl light:text-ink-prose dark:text-prose
font-variation-settings: "opsz" 24, "wght" 600
"[Good morning], [Name]."

Right: font-mono text-xs light:text-ink-ghost dark:text-ghost "Thursday, 23 Jan 2025"

Below: font-body text-sm light:text-ink-prose-2 dark:text-prose-2 mt-1
"You have 3 tasks pending and 1 interview scheduled today."

─────────────────────────────────────
COMPONENT: ActiveSimulationCard
─────────────────────────────────────
col-span-8, card class p-0

TOP BAR (bg-paper-2 dark:bg-sheet-2, border-b, px-5 py-3, flex justify-between):
  Left: badge-active "ACTIVE" + "MERN Stack Developer" font-body text-sm font-medium ml-2
  Right: "Day 3 of 10" font-mono text-xs ghost + btn-primary "Continue →" ml-4

PROGRESS RAIL (full width, h-0.5 — thinner than before, more refined):
  LIGHT: bg-rule-light / DARK: bg-rule
  Fill: bg-signal 30% — no rounded corners on fill

TASKS SECTION (px-5 py-4):
  section-header "Today's tasks" / "3 tasks · 1 submitted" font-mono text-xs ghost

  3 TASK ROWS (border-b border-rule-light dark:border-rule last:border-0, py-3, flex items-start gap-3):
  
  STATUS INDICATOR:
    Pending: hollow circle (w-4 h-4, border-2 border-rule-light dark:border-rule-2 rounded-full)
    Submitted: green circle + Check (w-4 h-4 bg-go text-white rounded-full)
    Overdue: red circle + X (w-4 h-4 bg-stop text-white rounded-full)
  
  TASK CONTENT:
    Title: font-body text-sm font-medium light:text-ink-prose dark:text-prose
    Meta: task-type "CODE" + badge-hard + timer-danger "01:47:22"
  
  ACTION: btn-ghost text-xs for Open/Review

TEAM MESSAGES PREVIEW (px-5 py-3, border-t, bg-paper-2 dark:bg-sheet-2):
  section-title "Recent team messages"
  2 message rows: 20px avatar + font-mono text-xs ghost name/time + font-body text-xs prose-2 message

─────────────────────────────────────
COMPONENT: StatsPanel
─────────────────────────────────────
col-span-4, flex flex-col gap-4

STAT CARD 1 — Career Level:
  card p-4
  stat-label "Career level"
  stat-value "4" (Fraunces large optical size — editorial number)
  font-body text-sm light:text-ink-prose-2 dark:text-prose-2 "Junior Developer"
  XP bar: font-mono text-xs ghost "4,820 / 5,000 XP" + h-0.5 bar (signal fill)

STAT CARD 2 — Interview Score:
  card p-4
  stat-label "Interview performance"
  stat-value "77%"
  font-body text-sm ghost "Last: Technical · 82%"
  link-warm text-xs mt-2 "Practice interview →"

STAT CARD 3 — Quick Actions:
  card p-4, section-title "Quick actions" mb-3
  3 btn-secondary rows (full-width, left-aligned, gap-2):
  Play + "Start new simulation" / MessageSquare + "Begin interview" / FileText + "View my passport"

STAT CARD 4 — Streak:
  card p-4
  stat-label "Current streak"
  stat-value "7" days
  font-body text-xs ghost mt-1 "3 more days to unlock 'Streak Warrior'"

─────────────────────────────────────
COMPONENT: RecentBadges
─────────────────────────────────────
col-span-12, mt-2

section-header "Recent achievements" / link-warm text-xs "View all →"

BADGES (horizontal scroll, gap-3):
card-action inline-flex items-center gap-2 px-3 py-2:
  Icon (14px, colored) + font-body text-sm light:text-ink-prose dark:text-prose + font-mono text-xs ghost date

Locked: opacity-40 grayscale cursor-default

─────────────────────────────────────
LEADERBOARD WIDGET
─────────────────────────────────────
col-span-4 (part of StatsPanel)

card p-4
section-title "MERN Weekly Rank" mb-3

5 ranked rows (border-b border-rule-light dark:border-rule last:border-0, py-2, flex items-center gap-2):
  Rank: font-mono text-xs ghost w-4 "#1"—top 3 in caution color
  20px avatar (bg-paper-2 dark:bg-sheet-2 initials)
  Name: font-body text-sm flex-1 (current user: font-semibold + badge-neutral "You")
  XP: font-mono text-xs ghost

Current user row: bg-paper-2 dark:bg-sheet-2 rounded-base px-1

LOADING: skeleton class on all placeholder elements. useState loading, 1s simulated delay.

THEME NOTE: Every element must look intentional in BOTH light and dark mode.
Light mode is warm studio. Dark mode is late-night focus.
```

---

### PROMPT 5 — Simulation Workspace

**Files:** `app/simulation/[sessionId]/page.tsx`, sub-components

```
Build the Simulation Workspace — core product screen of MentriQ Shadow.

DESIGN: A real work interface. Dense. Functional. Not decorative.
THEME: Full light/dark support. Dark mode likely to be user preference here. Both look professional.

TECH: Next.js 14, TypeScript, Tailwind CSS, Framer Motion (minimal), Lucide React, Monaco Editor (dynamic import, ssr: false)

LAYOUT: 100vh, no outer scroll. 3-column fixed.
┌─────────────┬──────────────────────┬──────────────────┐
│  TEAM CHAT  │     TASK BOARD       │   CODE EDITOR    │
│    276px    │      flex-1          │     316px        │
└─────────────┴──────────────────────┴──────────────────┘
44px session topbar above all columns.

SESSION TOPBAR (44px, border-b, px-4, flex items-center gap-4):
  LIGHT: bg-paper border-b border-rule-light
  DARK: bg-ink border-b border-rule
  
  LEFT: ArrowLeft btn-icon + "MERN Stack Developer" font-body text-sm font-medium ghost
  CENTER: Day progress — 10 marks (16×3px each, gap-1):
    Past: bg-rule-light-2 dark:bg-rule-2 / Current: bg-signal / Future: bg-rule-light dark:bg-rule
  RIGHT: font-mono text-xs text-go "+80 XP today" + ThemeToggle (icon variant) + Settings btn-icon

─────────────────────────────────────
LEFT: TEAM CHAT (276px, border-r, flex flex-col)
─────────────────────────────────────
LIGHT: border-r border-rule-light bg-paper
DARK: border-r border-rule bg-ink

CHAT HEADER (40px, border-b, px-3, flex justify-between):
  "Team" font-body text-xs font-semibold ghost
  4 overlapping 20px avatars + dot-online

MESSAGES AREA (flex-1, overflow-y-auto, px-3 py-2):
  Message bubbles:
  LIGHT: bg-paper-2 (received) / bg-signal text-white (sent)
  DARK: bg-sheet-2 (received) / bg-signal text-white (sent)
  
  Persona names: font-mono text-xs ghost "[Name] · Team Lead · 9:12 AM"
  Bubble text: font-body text-sm
  
  Typing indicator: 3 animated dots in a bubble

INPUT (shrink-0, border-t, px-3 py-2):
  Textarea: input class, font-body text-sm, resize-none
  font-mono text-2xs text-dim "Team replies in v2"

─────────────────────────────────────
CENTER: TASK BOARD (flex-1, border-r)
─────────────────────────────────────
LIGHT: border-r border-rule-light bg-paper
DARK: border-r border-rule bg-ink

TASK HEADER (40px, border-b, px-4, flex justify-between):
  "Today's Tasks" font-body text-xs font-semibold ghost
  "3 tasks · 2 pending" font-mono text-xs ghost
  XP ticker: "+80 XP" text-go animate-xp-rise (fades after 2s)

TASK ROWS (divide-y divide-rule-light dark:divide-rule):
Each task (px-4 py-4, hover:bg-paper-2 dark:hover:bg-sheet-2):
  Row 1: title (font-body text-sm font-semibold) + difficulty badge
  Row 2: task-type tag + font-mono text-xs id + timer
  Row 3: description (text-sm prose-2, collapsible via Framer Motion height)
  Client note: border-l-2 border-rule-light dark:border-rule, pl-3, font-mono text-xs ghost italic
  Actions: status display + submit/review btn

SUBMISSION OVERLAY (slide from right, 60vw, full height):
  LIGHT: bg-card border-l border-rule-light
  DARK: bg-sheet border-l border-rule
  Monaco Editor / textarea / file drop zone
  Footer: btn-ghost "Cancel" + btn-primary "Submit for review →"

─────────────────────────────────────
RIGHT: CODE EDITOR (316px, flex flex-col)
─────────────────────────────────────
LIGHT: bg-paper (tabs/footer) + Monaco's own vs-light theme
DARK: bg-ink + Monaco vs-dark theme

EDITOR HEADER (40px, border-b, px-3, flex justify-between):
  Tab switcher (Code / Notes): 
    Active: bg-paper-2 dark:bg-sheet-2 text-ink-prose dark:text-prose
    Inactive: text-ink-ghost dark:text-ghost
  Language select (font-mono text-xs ghost) + Copy + Reset btn-icons

EDITOR AREA: Monaco (dynamically imported, ssr: false)
  Dark mode: theme "vs-dark" / Light mode: theme "vs-light"
  fontSize 13, fontFamily "'JetBrains Mono', monospace"
  fontLigatures: true (JetBrains Mono supports ligatures)
  minimap disabled, no scrollBeyondLastLine

NOTES TAB: textarea, font-mono text-sm, light bg-paper dark bg-ink

EDITOR FOOTER (28px, border-t, px-3, flex justify-between):
  font-mono text-2xs ghost "javascript · 47 lines" / "Autosaved 2s ago"

Monaco theme switching code:
  import { useTheme } from "@/components/ThemeProvider";
  const { resolvedTheme } = useTheme();
  // Pass theme="vs-dark" or "vs-light" to Monaco based on resolvedTheme

MOBILE (<768px): Bottom tab bar, stack columns vertically.

STATE TYPES: TaskStatus, TaskType, Difficulty, Task, ChatMessage (same as before)
```

---

### PROMPT 6 — AI Interview Page

**File:** `app/interview/[interviewId]/page.tsx`

```
Build the AI Interview page for MentriQ Shadow.

DESIGN: Full-screen focused experience. High gravity, no distraction.
THEME: Full light/dark. Light: clean daylight studio. Dark: focused late-night session.

LAYOUT: 100vh, no sidebar. Header (52px) → Chat (flex-1) → Input (fixed bottom)

HEADER (52px, border-b):
  LIGHT: bg-paper/95 border-b border-rule-light
  DARK: bg-ink/95 border-b border-rule
  
  Left: ArrowLeft (disabled during interview) + badge-interview "TECHNICAL" + font-body text-sm ghost "MERN Stack Developer"
  Center: font-display text-xl prose timer "12:34" (Fraunces for the timer — makes it feel weighty)
         font-mono text-xs ghost "Question 3 of ~10"
  Right: av-meera 28px + "Meera · AI Interviewer" text-xs ghost + "End Interview" btn-danger text-xs
         + ThemeToggle (icon variant) — users may want to switch for focus

CHAT AREA (max-w-2xl mx-auto, px-6 py-6):
  PRE-INTERVIEW:
    Centered card (card class max-w-sm mx-auto p-8 text-center mt-24):
    av-meera 40px (centered)
    "Your interviewer is ready." — font-display text-base font-semibold (Fraunces adds warmth here)
    "Technical Interview · 8–12 questions · ~20 minutes" — font-mono text-xs ghost
    "Take a breath. Answer clearly. Think out loud." — font-body text-sm ghost
    btn-primary full-width mt-6 "Begin Interview →"

  AI MESSAGES (left, max-w-[65%]):
    LIGHT: bg-card border border-rule-light / DARK: bg-sheet border border-rule
    av-meera 32px + name font-mono text-xs ghost + bubble
    Framer Motion: x -12→0, opacity 0→1

  USER MESSAGES (right, max-w-[65%]):
    bg-signal text-white — same in both modes (signal blue works on both)

  TYPING INDICATOR: 3 dots (dot-1/2/3 animations)

SCORE REVEAL:
  NOT a ring/circle — a large editorial Fraunces number:
  font-display text-[120px] leading-none light:text-ink-prose dark:text-prose
  font-variation-settings: "opsz" 120, "wght" 600
  Counts up via useCountUp hook
  
  Dimension score bars (h-0.5, colored by score value)
  AI feedback card
  Actions: btn-primary "View full report →" + btn-secondary "Back to dashboard"

INPUT BAR (fixed bottom, border-t):
  LIGHT: bg-paper border-t border-rule-light / DARK: bg-ink border-t border-rule
  Textarea: input class, resize-none, min-h-[48px] max-h-[120px]
  Send button: btn-icon with Send icon
  Ctrl+Enter sends
```

---

### PROMPT 7 — Evaluation Results Page

**File:** `app/evaluation/[taskId]/page.tsx`

```
Build the Evaluation Results page for MentriQ Shadow.

DESIGN: Serious satisfaction. The reward is earned. Not a party.
THEME: Full light/dark mode. Both feel like receiving a professional review.

LAYOUT: Single scroll, max-w-2xl mx-auto px-6 pt-24 pb-16

─────────────────────────────────────
SECTION 1: SCORE HERO
─────────────────────────────────────
Text-centered.

Eyebrow: font-mono text-xs ghost "task_019 · MERN · submitted 12 min before deadline"

THE SCORE — Fraunces at maximum optical size:
  font-display leading-none light:text-ink-prose dark:text-prose tracking-tight
  font-variation-settings: "opsz" 120, "wght" 600
  text-[120px] "78"
  
  counts up from 0 via useCountUp(78, 1200, 500)

Below: font-body text-lg light:text-ink-prose-2 dark:text-prose-2 "/ 100"

Score badge + XP: badge variant by score + font-mono text-sm text-go animate-xp-rise "+120 XP"

Context chips (3): card class inline-flex, font-mono text-xs ghost, Clock/Code/CheckSquare icons

Confetti (score ≥ 85): canvas-confetti dynamic import, warm colors including India-appropriate palette
  colors: ['#2558E8', '#1A9E52', '#7733E0', '#D4740A']

─────────────────────────────────────
SECTION 2: SCORE BREAKDOWN
─────────────────────────────────────
card p-6 mt-12

section-header + badge-neutral "AI-reviewed"

5 dimension rows (stagger Framer Motion enter-right):
  font-body text-sm w-44 prose / flex-1 h-px expanding bar / font-mono text-sm w-8

Light mode bars: go/caution/stop colored fills on bg-rule-light track
Dark mode bars: same semantic colors on bg-rule track

─────────────────────────────────────
SECTION 3: AI FEEDBACK
─────────────────────────────────────
card p-6 mt-4

Header: Terminal icon + "AI Review" font-body text-sm font-semibold + badge-neutral "LLaMA 3.3-70B"

Feedback: font-body text-sm light:text-ink-prose-2 dark:text-prose-2 leading-relaxed

Strengths: font-mono text-xs text-go uppercase "What worked" + Check-icon list
Improvements: font-mono text-xs text-caution uppercase "Where to improve" + arrow-icon list

Senior quote: border-l-2 border-rule-light dark:border-rule, pl-4, font-body text-sm italic ghost

─────────────────────────────────────
SECTION 4 & 5: TEAM REACTIONS + ACTIONS
─────────────────────────────────────
Same as before but with full light/dark styling on all elements.
btn-secondary / share icons / btn-primary with light:dark variants from token classes.
```

---

### PROMPT 8 — Shadow Passport

**File:** `app/passport/[userId]/page.tsx`

```
Build the Shad