"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { getUrlParam, showToast } from "@/lib/utils";

export default function PassportPage() {
  useEffect(() => {
    const userId = getUrlParam("user_id");

    async function loadPassport() {
      if (!userId) {
        document.getElementById("passport-loading").style.display = "none";
        document.getElementById("passport-content").style.display = "block";
        document.getElementById("passport-name").textContent = "No user specified";
        return;
      }

      try {
        const data = await api.get(`/auth/${userId}/passport`);
        document.getElementById("passport-loading").style.display = "none";
        document.getElementById("passport-content").style.display = "block";

        const name = data.name || "Anonymous";
        const level = data.career_level || 1;
        document.getElementById("passport-name").textContent = name;
        document.getElementById("passport-level").textContent = `Level ${level}`;
        document.getElementById("passport-avatar").textContent = name[0] || "?";

        renderSimulations(data.simulations || []);
        renderInterviews(data.interviews || []);
        renderBadges(data.badges || []);
      } catch (err) {
        document.getElementById("passport-loading").style.display = "none";
        document.getElementById("passport-content").style.display = "block";
        document.getElementById("passport-name").textContent = "Failed to load";
        document.querySelector(".passport-tagline").textContent = err.message;
      }

      document.getElementById("share-passport-btn")?.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href)
          .then(() => showToast("Passport URL copied to clipboard!", "success"))
          .catch(() => showToast("Failed to copy URL", "error"));
      });
    }

    function renderSimulations(simulations) {
      const container = document.getElementById("passport-simulations");
      if (!simulations.length) {
        container.innerHTML = '<div class="empty-state"><p>No simulations completed yet.</p></div>';
        return;
      }
      container.innerHTML = simulations.map(sim => `
        <div class="flex items-center justify-between p-3 bg-[var(--color-surface-2)] rounded-[var(--radius-sm)]">
          <div>
            <h4 class="m-0 text-sm">${sim.career_track || "Simulation"}</h4>
            <span class="text-[var(--color-text-muted)] text-xs">Day ${sim.current_day || 1}/${sim.total_days || 10}</span>
          </div>
          <div class="font-semibold text-[var(--color-primary)]">${sim.industry_readiness_score || "—"}</div>
        </div>
      `).join("");
    }

    function renderInterviews(interviews) {
      const container = document.getElementById("passport-interviews");
      if (!interviews.length) {
        container.innerHTML = '<div class="empty-state"><p>No interviews completed yet.</p></div>';
        return;
      }
      container.innerHTML = interviews.map(iv => `
        <div class="p-3 bg-[var(--color-surface-2)] rounded-[var(--radius-sm)] text-center">
          <h4 class="m-0 text-sm">${iv.interview_type || "Interview"}</h4>
          <div class="text-xl font-bold text-[var(--color-primary)]">${iv.overall_score || "—"}</div>
          <div class="text-xs text-[var(--color-text-muted)]">${iv.interview_type || "Technical"}</div>
        </div>
      `).join("");
    }

    function renderBadges(badges) {
      const container = document.getElementById("passport-badges");
      if (!badges.length) {
        container.innerHTML = '<div class="empty-state"><p>No badges earned yet.</p></div>';
        return;
      }
      const badgeIcons = { "first-submission": "🏆", "bug-slayer": "🐛", "interview-ace": "🎯", "7-day-streak": "🔥", "code-master": "💻", "design-pro": "🎨" };
      container.innerHTML = badges.map(badge => `
        <div class="text-center p-3">
          <div class="text-3xl mb-1">${badgeIcons[badge.badge_slug] || "⭐"}</div>
          <span class="text-xs text-[var(--color-text-muted)]">${badge.name || badge.badge_slug?.replace("-", " ") || "Badge"}</span>
        </div>
      `).join("");
    }

    loadPassport();
  }, []);

  return (
    <main className="max-w-[720px] mx-auto p-6 pt-10">
      <div id="passport-loading" className="text-center py-20 px-6">
        <div className="spinner spinner-lg mx-auto"></div>
        <p className="mt-4">Loading Shadow Passport...</p>
      </div>

      <div id="passport-content" className="hidden">
        <div className="text-center mb-8">
          <div id="passport-avatar" className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-3xl font-bold mx-auto mb-4">?</div>
          <h2 id="passport-name" className="mb-1">Loading...</h2>
          <div id="passport-level" className="text-[var(--color-primary)] font-semibold mb-1">Level 1</div>
          <p className="passport-tagline text-sm text-[var(--color-text-muted)] m-0">Aspiring Developer</p>
        </div>

        <div className="mb-6">
          <h3 className="mb-3">🎮 Completed Simulations</h3>
          <div id="passport-simulations" className="flex flex-col gap-2">
            <div className="empty-state"><p>No simulations completed yet.</p></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3">🎤 Interview Scores</h3>
          <div id="passport-interviews" className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
            <div className="empty-state"><p>No interviews completed yet.</p></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3">🏅 Badges</h3>
          <div id="passport-badges" className="flex gap-3 flex-wrap">
            <div className="empty-state"><p>No badges earned yet.</p></div>
          </div>
        </div>

        <div className="text-center p-8 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5 mb-6">
          <div className="w-12 h-12 rounded-full bg-[var(--color-success)] flex items-center justify-center mx-auto mb-3 font-bold text-xl">✓</div>
          <h4>Verified by MentriQ Shadow</h4>
          <p className="text-sm text-[var(--color-text-muted)]">This passport is a verified record of real simulation-based work experience.</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button className="btn btn-primary" id="share-passport-btn">Share Passport</button>
          <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
        </div>
      </div>
    </main>
  );
}
