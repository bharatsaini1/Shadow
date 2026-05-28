"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { getUserId, logout } from "@/lib/auth";
import { showToast, animateCountUp, getXpForLevel, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = `
        <nav class="navbar h-16 bg-[#13131A]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-[100]">
          <div class="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
            <a href="/dashboard" class="flex items-center gap-2.5 font-['Space_Grotesk'] text-lg font-bold text-[var(--color-text)] no-underline">
              <span class="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-[var(--radius-sm)] flex items-center justify-center text-sm">MQ</span>
              MentriQ
            </a>
            <button class="btn btn-ghost btn-sm" id="logout-btn">Logout</button>
          </div>
        </nav>`;
    }

    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (sidebarPlaceholder) {
      sidebarPlaceholder.innerHTML = `
        <aside class="sidebar w-[260px] bg-[var(--color-surface)] border-r border-white/5 fixed top-16 left-0 bottom-0 z-50 overflow-y-auto">
          <div class="p-4">
            <nav class="flex flex-col gap-1">
              <a href="/dashboard" class="sidebar-link active flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-primary)] text-sm font-medium bg-[rgba(91,78,255,0.08)] no-underline">
                <span class="text-lg w-6 text-center">📊</span> Dashboard
              </a>
              <a href="/dashboard" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] text-sm font-medium no-underline">
                <span class="text-lg w-6 text-center">🎮</span> Simulations
              </a>
              <a href="/dashboard" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] text-sm font-medium no-underline">
                <span class="text-lg w-6 text-center">🏆</span> Badges
              </a>
              <a href="/passport" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] text-sm font-medium no-underline">
                <span class="text-lg w-6 text-center">🛂</span> Passport
              </a>
            </nav>
          </div>
        </aside>`;
    }

    loadDashboard(userId);
    loadCareerTracks();
    document.getElementById("dashboard-loading").style.display = "none";
    document.getElementById("dashboard-content").style.display = "block";

    document.addEventListener("click", (e) => {
      if (e.target.closest("#logout-btn")) logout();
      if (e.target.closest("#start-simulation-btn")) {
        document.getElementById("track-modal").classList.add("active");
      }
      if (e.target.closest(".modal-backdrop") || e.target.closest("#close-modal")) {
        document.getElementById("track-modal").classList.remove("active");
      }
    });

    document.addEventListener("click", (e) => {
      const trackCard = e.target.closest(".track-card");
      if (trackCard) startSimulation(trackCard.dataset.trackId);
    });

    document.addEventListener("click", (e) => {
      const cta = e.target.closest(".sim-card-cta");
      if (cta) {
        const sessionId = cta.dataset.sessionId;
        if (cta.dataset.action === "resume") {
          window.location.href = `/simulation?session_id=${sessionId}`;
        } else if (cta.dataset.action === "review") {
          window.location.href = `/evaluation?task_id=${cta.dataset.taskId}`;
        }
      }
    });
  }, []);

  async function loadDashboard(userId) {
    try {
      console.log("Fetching dashboard for user:", userId);
      const data = await api.get(`/auth/${userId}/dashboard`);
      console.log("Dashboard API response:", data);
      renderStats(data);
      renderActiveSimulations(data.active_simulations || []);
      console.log("Active simulations rendered:", data.active_simulations?.length || 0);
      renderCompletedSimulations(data.completed_simulations || []);
      renderBadges(data.badges || []);
      renderLeaderboard(data.leaderboard || []);
    } catch (err) {
      console.error("Dashboard load failed:", err);
      showToast(err.message, "error");
      document.getElementById("dashboard-content").innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠</div>
          <h3>Failed to load dashboard</h3>
          <p>${err.message}</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>`;
    }
  }

  function renderStats(data) {
    const xp = data.total_xp || 0;
    const level = data.career_level || 1;
    const streak = data.daily_streak || 0;
    const xpForNext = getXpForLevel(level + 1);
    const xpForCurrent = getXpForLevel(level);
    const progress = xpForNext > xpForCurrent ? ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100 : 0;

    const xpBar = document.getElementById("xp-progress-fill");
    if (xpBar) xpBar.style.width = `${Math.min(progress, 100)}%`;

    const xpEl = document.getElementById("total-xp");
    const levelEl = document.getElementById("career-level");
    const totalXpStat = document.getElementById("total-xp-stat");
    const streakEl = document.getElementById("daily-streak");

    if (xpEl) animateCountUp(xpEl, xp);
    if (totalXpStat) animateCountUp(totalXpStat, xp);
    if (levelEl) {
      levelEl.textContent = level;
      const badge = levelEl.parentElement?.querySelector(".level-badge");
      if (badge) badge.textContent = `Level ${level}`;
    }
    if (streakEl) animateCountUp(streakEl, streak);
  }

  function renderActiveSimulations(simulations) {
    const container = document.getElementById("active-simulations");
    if (!container) return;
    if (!simulations.length) {
      container.innerHTML = '<div class="empty-state"><p>No active simulations. Start one now!</p></div>';
      return;
    }
    container.innerHTML = simulations.map((sim) => `
      <div class="sim-card bg-[var(--color-surface)] border border-white/5 rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-card)]">
        <div class="flex justify-between items-start mb-3">
          <h4 class="m-0">${sim.career_track || "Simulation"}</h4>
          <span class="badge badge-info">Day ${sim.current_day || 1}/${sim.total_days || 10}</span>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${((sim.current_day||1)/(sim.total_days||10))*100}%"></div></div>
        <div class="flex justify-between items-center mt-3">
          <span class="text-[var(--color-text-muted)] text-sm">XP: ${sim.xp_earned || 0}</span>
          <button class="btn btn-sm btn-primary sim-card-cta" data-action="resume" data-session-id="${sim.id}">Resume</button>
        </div>
      </div>
    `).join("");
  }

  function renderCompletedSimulations(simulations) {
    const container = document.getElementById("completed-simulations");
    if (!container) return;
    if (!simulations.length) {
      container.innerHTML = '<div class="empty-state"><p>No completed simulations yet.</p></div>';
      return;
    }
    container.innerHTML = simulations.map((sim) => `
      <div class="sim-card completed bg-[var(--color-surface)] border border-white/5 rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-card)] opacity-80">
        <div class="flex justify-between items-start mb-3">
          <h4 class="m-0">${sim.career_track || "Simulation"}</h4>
          <span class="badge badge-success">Score: ${sim.industry_readiness_score || "—"}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[var(--color-text-muted)] text-sm">Completed ${formatDate(sim.completed_at)}</span>
          <button class="btn btn-sm btn-ghost sim-card-cta" data-action="review" data-task-id="${sim.last_task_id || ""}">Review</button>
        </div>
      </div>
    `).join("");
  }

  function renderBadges(badges) {
    const container = document.getElementById("badges-grid");
    if (!container) return;
    if (!badges.length) {
      container.innerHTML = '<div class="empty-state"><p>No badges earned yet. Complete tasks to earn badges!</p></div>';
      return;
    }
    const badgeIcons = { "first-submission": "🏆", "bug-slayer": "🐛", "interview-ace": "🎯", "7-day-streak": "🔥", "code-master": "💻", "design-pro": "🎨" };
    container.innerHTML = badges.map((badge) => `
      <div class="text-center p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5" title="${badge.name || badge.badge_slug}">
        <div class="text-3xl mb-2">${badgeIcons[badge.badge_slug] || "⭐"}</div>
        <span class="text-xs text-[var(--color-text-muted)]">${badge.name || badge.badge_slug?.replace("-", " ") || "Badge"}</span>
      </div>
    `).join("");
  }

  function renderLeaderboard(entries) {
    const container = document.getElementById("leaderboard-body");
    if (!container) return;
    if (!entries.length) {
      const parent = document.getElementById("leaderboard-section");
      if (parent) parent.innerHTML = '<div class="empty-state"><p>No leaderboard data yet.</p></div>';
      return;
    }
    container.innerHTML = entries.map((entry, i) => `
      <tr>
        <td class="rank">${i + 1 <= 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}</td>
        <td class="text-[var(--color-text)]">${entry.name || "Anonymous"}</td>
        <td class="text-[var(--color-text-muted)]">Level ${entry.level || 1}</td>
        <td class="text-[var(--color-text-muted)]">${entry.xp || 0} XP</td>
      </tr>
    `).join("");
  }

  async function loadCareerTracks() {
    try {
      console.log("Fetching career tracks...");
      const tracks = await api.get("/simulations/career-tracks");
      console.log("Career tracks response:", tracks);
      const container = document.getElementById("track-list");
      if (!container) return;
      container.innerHTML = tracks.map((track) => `
        <div class="track-card p-4 bg-[var(--color-surface-2)] rounded-[var(--radius-sm)] cursor-pointer transition-all duration-200" data-track-id="${track.id}">
          <h4 class="mb-1">${track.name}</h4>
          <p class="text-[var(--color-text-muted)] text-sm mb-2">${track.description || ""}</p>
          <span class="badge badge-info">${track.difficulty_level || "beginner"}</span>
        </div>
      `).join("");
    } catch (err) {
      console.error("Failed to load career tracks:", err);
    }
  }

  async function startSimulation(trackId) {
    try {
      const result = await api.post("/simulations/start", { career_track_id: trackId });
      showToast("Simulation started!", "success");
      document.getElementById("track-modal")?.classList.remove("active");
      window.location.href = `/simulation?session_id=${result.session_id}`;
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  return (
    <>
      <div id="navbar-placeholder"></div>
      <div className="page-wrapper">
        <div id="sidebar-placeholder"></div>
        <div id="dashboard-loading" className="fixed inset-0 bg-[var(--color-bg)] z-[400] flex-col items-center justify-center gap-4" style={{display:"flex"}}>
          <div className="spinner spinner-lg"></div>
          <p>Loading dashboard...</p>
        </div>
        <main className="main-content ml-[260px] pt-16" id="dashboard-content" style={{display:"none"}}>
          <div className="mb-6 bg-[var(--color-surface)] rounded-[var(--radius-md)] p-5 border border-white/5">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[var(--color-text-muted)]">Career Progress</span>
              <span className="text-sm font-semibold"><span id="total-xp">0</span> XP</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" id="xp-progress-fill" style={{width:"0%"}}></div></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {icon:"⭐",id:"total-xp-stat",label:"Total XP",value:"0"},
              {icon:"📈",id:"career-level",label:"Career Level",badge:"Level 1"},
              {icon:"🔥",id:"daily-streak",label:"Day Streak",value:"0"},
            ].map((stat,i) => (
              <div key={i} className="stat-card bg-[var(--color-surface)] border border-white/5 rounded-[var(--radius-md)] p-5 text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold font-['Space_Grotesk']">
                  <span id={stat.id}>{stat.value || ""}</span>
                </div>
                <div className="text-sm text-[var(--color-text-muted)]">
                  {stat.label}
                  {stat.badge && <span className="level-badge block text-xs text-[var(--color-primary)]">{stat.badge}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4"><h3>Active Simulations</h3></div>
          <div id="active-simulations" className="sim-grid grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 mb-8">
            <div className="empty-state"><p>Loading...</p></div>
          </div>

          <div className="flex justify-between items-center mb-4"><h3>Completed Simulations</h3></div>
          <div id="completed-simulations" className="sim-grid grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 mb-8">
            <div className="empty-state"><p>Loading...</p></div>
          </div>

          <div className="flex justify-between items-center mb-4"><h3>Badges</h3></div>
          <div id="badges-grid" className="badges-grid grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 mb-8">
            <div className="empty-state"><p>Loading...</p></div>
          </div>

          <div id="leaderboard-section">
            <div className="flex justify-between items-center mb-4"><h3>Leaderboard</h3></div>
            <table className="leaderboard-table w-full border-collapse bg-[var(--color-surface)] rounded-[var(--radius-md)] overflow-hidden border border-white/5">
              <thead>
                <tr className="border-b border-white/5">
                  {["Rank","Name","Level","XP"].map(h => <th key={h} className="text-left px-4 py-3 text-xs text-[var(--color-text-muted)] font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody id="leaderboard-body">
                <tr><td colSpan="4" className="text-center text-[var(--color-text-muted)] p-6">Loading...</td></tr>
              </tbody>
            </table>
          </div>

          <div className="text-center py-6">
            <button className="btn btn-primary btn-lg" id="start-simulation-btn">Start New Simulation</button>
          </div>
        </main>
      </div>

      <div className="modal-backdrop" id="track-modal">
        <div className="modal">
          <div className="modal-header">
            <h3>Choose a Career Track</h3>
            <button className="modal-close" id="close-modal">&times;</button>
          </div>
          <div id="track-list" className="track-list flex flex-col gap-2">
            <div className="text-center p-6">
              <div className="spinner"></div>
              <p className="mt-3 text-[var(--color-text-muted)]">Loading tracks...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
