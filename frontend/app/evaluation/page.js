"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { getUrlParam, showToast, animateCountUp } from "@/lib/utils";

export default function EvaluationPage() {
  useEffect(() => {
    const taskId = getUrlParam("task_id");
    if (!taskId) { showToast("No task ID provided", "error"); return; }
    loadEvaluation(taskId);

    async function loadEvaluation(tid) {
      try {
        document.getElementById("loading-evaluation").style.display = "block";
        document.getElementById("evaluation-content").style.display = "none";
        const data = await api.get(`/tasks/${tid}/evaluation`);
        document.getElementById("loading-evaluation").style.display = "none";
        document.getElementById("evaluation-content").style.display = "block";
        renderScores(data);
        renderFeedback(data);
        renderSeniorCallout(data);
        setupCTAs(tid, data);
      } catch (err) {
        document.getElementById("loading-evaluation").style.display = "none";
        showToast(err.message, "error");
      }
    }

    function renderScores(data) {
      const overall = data.overall_score || 0;
      const overallEl = document.getElementById("overall-score-value");
      if (overallEl) animateCountUp(overallEl, overall);

      const scores = [
        { key: "code_quality", label: "Code Quality", value: data.code_quality_score || 0 },
        { key: "communication", label: "Communication", value: data.communication_score || 0 },
        { key: "problem_solving", label: "Problem Solving", value: data.problem_solving_score || 0 },
        { key: "time_management", label: "Time Management", value: data.time_management_score || 0 },
        { key: "completeness", label: "Completeness", value: data.completeness_score || 0 },
      ];

      const container = document.getElementById("score-bars");
      if (!container) return;
      container.innerHTML = scores.map((s) => `
        <div class="mb-4">
          <div class="flex justify-between mb-1">
            <span class="text-sm text-[var(--color-text-muted)]">${s.label}</span>
            <span class="text-sm font-semibold text-[var(--color-text)]">${s.value}</span>
          </div>
          <div class="h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
            <div class="score-bar-fill h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full w-0 transition-[width] duration-1000 ease-out" data-score="${s.value}"></div>
          </div>
        </div>
      `).join("");

      requestAnimationFrame(() => {
        container.querySelectorAll(".score-bar-fill").forEach((bar) => {
          const score = parseInt(bar.dataset.score) || 0;
          setTimeout(() => { bar.style.width = `${score}%`; }, 300);
        });
      });

      const xp = data.xp_earned || 0;
      const xpEl = document.getElementById("xp-earned");
      if (xpEl) {
        setTimeout(() => {
          animateCountUp(xpEl, xp);
          const parent = xpEl.parentElement;
          if (parent) parent.classList.add("celebration");
        }, 800);
      }
    }

    function renderFeedback(data) {
      const feedbackEl = document.getElementById("feedback-text");
      if (feedbackEl) feedbackEl.textContent = data.feedback || "No detailed feedback available.";
      const strengthsEl = document.getElementById("strengths-list");
      if (strengthsEl) {
        const strengths = data.strengths || [];
        strengthsEl.innerHTML = strengths.length ? strengths.map(s => `<li class="py-1 text-sm text-[var(--color-text-muted)]">${s}</li>`).join("") : '<li class="py-1 text-sm text-[var(--color-text-muted)]">No specific strengths noted.</li>';
      }
      const improvementsEl = document.getElementById("improvements-list");
      if (improvementsEl) {
        const improvements = data.improvement_suggestions || [];
        improvementsEl.innerHTML = improvements.length ? improvements.map(s => `<li class="py-1 text-sm text-[var(--color-text-muted)]">${s}</li>`).join("") : '<li class="py-1 text-sm text-[var(--color-text-muted)]">Keep up the good work!</li>';
      }
    }

    function renderSeniorCallout(data) {
      const seniorEl = document.getElementById("senior-callout");
      if (seniorEl) seniorEl.textContent = data.what_a_senior_would_say || "A senior developer would appreciate your effort on this task.";
    }

    function setupCTAs(tid, data) {
      document.getElementById("next-task-btn")?.addEventListener("click", () => window.location.href = "/dashboard");
      document.getElementById("start-interview-btn")?.addEventListener("click", async () => {
        try {
          const result = await api.post("/interviews/start", { simulation_session_id: "", interview_type: "technical" });
          window.location.href = `/interview?interview_id=${result.interview_id}`;
        } catch (err) { showToast(err.message, "error"); }
      });
    }
  }, []);

  return (
    <main className="main-content evaluation-page">
      <div id="loading-evaluation" className="text-center py-20 px-6">
        <div className="spinner spinner-lg mx-auto"></div>
        <p className="mt-4">Loading your evaluation...</p>
      </div>

      <div id="evaluation-content" className="hidden">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div id="score-ring" className="w-[120px] h-[120px] rounded-full border-4 border-[var(--color-primary)] flex items-center justify-center mx-auto">
              <div className="text-center">
                <div className="score-number text-4xl font-bold font-['Space_Grotesk']" id="overall-score-value">0</div>
                <div className="text-xs text-[var(--color-text-muted)]">Overall</div>
              </div>
            </div>
          </div>
          <h2>Task Evaluation</h2>
          <p>Here&apos;s how your submission was scored across key areas.</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] p-6 border border-white/5 mb-6">
          <h3>Score Breakdown</h3>
          <div id="score-bars"></div>
        </div>

        <div id="xp-celebration" className="text-center p-6 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5 mb-6">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold font-['Space_Grotesk'] text-[var(--color-accent)]">+<span id="xp-earned">0</span> XP</div>
          <div className="text-sm text-[var(--color-text-muted)]">Earned from this task</div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] p-6 border border-white/5 mb-6">
          <h3>Feedback</h3>
          <div id="feedback-text" className="text-sm text-[var(--color-text-muted)] mb-5"></div>
          <div className="grid grid-cols-2 gap-5">
            <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-4">
              <h4>💪 Strengths</h4>
              <ul id="strengths-list"></ul>
            </div>
            <div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-4">
              <h4>🎯 Areas to Improve</h4>
              <ul id="improvements-list"></ul>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(91,78,255,0.08)] border border-[rgba(91,78,255,0.2)] rounded-[var(--radius-md)] p-5 mb-6">
          <span className="text-xs text-[var(--color-primary)] font-semibold uppercase tracking-wider">What a Senior Would Say</span>
          <p id="senior-callout" className="mt-2 text-sm"></p>
        </div>

        <div className="flex gap-3 justify-center flex-wrap py-6">
          <button className="btn btn-primary" id="next-task-btn">Next Task</button>
          <button className="btn btn-accent" id="start-interview-btn">Start Interview</button>
          <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
        </div>
      </div>
    </main>
  );
}
