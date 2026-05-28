"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { getUrlParam, showToast, pollUntilReady, formatDate } from "@/lib/utils";

export default function SimulationPage() {
  useEffect(() => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = `
        <nav class="navbar h-16 bg-[#13131A]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-[100]">
          <div class="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
            <a href="/dashboard" class="flex items-center gap-2.5 font-['Space_Grotesk'] text-lg font-bold text-[var(--color-text)] no-underline">
              <span class="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-[var(--radius-sm)] flex items-center justify-center text-sm">MQ</span>
              MentriQ
            </a>
          </div>
        </nav>`;
    }

    const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
    if (sidebarPlaceholder) {
      sidebarPlaceholder.innerHTML = `
        <aside class="sidebar w-[260px] bg-[var(--color-surface)] border-r border-white/5 fixed top-16 left-0 bottom-0 z-50 overflow-y-auto">
          <div class="p-4">
            <nav class="flex flex-col gap-1">
              <a href="/dashboard" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] text-sm font-medium no-underline">
                <span class="text-lg w-6 text-center">📊</span> Dashboard
              </a>
              <a href="/dashboard" class="sidebar-link active flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-primary)] text-sm font-medium bg-[rgba(91,78,255,0.08)] no-underline">
                <span class="text-lg w-6 text-center">🎮</span> Simulations
              </a>
              <a href="/passport" class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] text-sm font-medium no-underline">
                <span class="text-lg w-6 text-center">🛂</span> Passport
              </a>
            </nav>
          </div>
        </aside>`;
    }

    let sessionData = null;
    let activeTaskId = null;
    let monacoEditor = null;
    let countdownIntervals = [];

    const sessionId = getUrlParam("session_id");
    if (!sessionId) {
      document.getElementById("loading-tasks").style.display = "none";
      const taskBoard = document.getElementById("task-board");
      if (taskBoard) {
        taskBoard.innerHTML = '<div class="empty-state"><div class="empty-icon" style="font-size:3rem;margin-bottom:12px">🎮</div><h3>No Simulation Selected</h3><p>Start a simulation from the dashboard to see your tasks here.</p><a href="/dashboard" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Go to Dashboard</a></div>';
      }
      const chatContainer = document.getElementById("team-chat-messages");
      if (chatContainer) chatContainer.innerHTML = '<div class="text-center p-6 text-[var(--color-text-muted)] text-xs">Start a simulation to see team messages.</div>';
      return;
    }

    document.getElementById("session-id").dataset.sessionId = sessionId;
    loadSession(sessionId);

    async function loadSession(sid) {
      try {
        showLoading(true);
        sessionData = await api.get(`/simulations/${sid}`);
        document.getElementById("session-title").textContent = `${sessionData.career_track_name || "Simulation"} – Day ${sessionData.current_day || 1}`;
        const tasks = sessionData.tasks || [];
        if (!tasks.length) {
          await generateDay(sid);
        } else {
          renderTasks(tasks);
          await loadTeamMessages(sid);
        }
        showLoading(false);
      } catch (err) {
        showLoading(false);
        showToast(err.message, "error");
      }
    }

    async function generateDay(sid) {
      document.getElementById("loading-tasks").style.display = "flex";
      try {
        await api.post(`/simulations/${sid}/generate-day`);
        await pollUntilReady(async () => {
          try {
            const updated = await api.get(`/simulations/${sid}`);
            if (updated.tasks && updated.tasks.length > 0) return { status: "completed", tasks: updated.tasks };
            return { status: "processing" };
          } catch { return { status: "processing" }; }
        });
        document.getElementById("loading-tasks").style.display = "none";
        sessionData = await api.get(`/simulations/${sid}`);
        renderTasks(sessionData.tasks || []);
        await loadTeamMessages(sid);
      } catch (err) {
        document.getElementById("loading-tasks").style.display = "none";
        showToast(err.message, "error");
      }
    }

    function renderTasks(tasks) {
      const container = document.getElementById("task-board");
      if (!container) return;
      container.innerHTML = tasks.map((task, i) => `
        <div class="task-card ${task.status === "submitted" || task.status === "evaluated" ? "completed" : ""} bg-[var(--color-surface)] border border-white/5 rounded-[var(--radius-md)] p-5 transition-all duration-200" data-task-id="${task.id}">
          <div class="flex gap-2 items-center mb-2 flex-wrap">
            <span class="badge badge-${task.difficulty === "hard" ? "danger" : task.difficulty === "medium" ? "warning" : "success"}">${task.difficulty || "medium"}</span>
            <span class="badge badge-info">${task.task_type || "task"}</span>
            <span class="countdown-timer text-xs text-[var(--color-text-muted)]" data-deadline="${task.deadline_at || ""}">${task.deadline_hours ? `${task.deadline_hours}h left` : ""}</span>
          </div>
          <h4 class="mb-1">${task.title}</h4>
          <p class="text-sm mb-2">${task.description || ""}</p>
          ${task.client_context ? `<div class="text-xs text-[var(--color-text-muted)] mb-2"><strong>Client:</strong> ${task.client_context}</div>` : ""}
          <div class="mt-3">
            <button class="btn btn-sm ${task.status === "evaluated" ? "btn-ghost" : "btn-primary"} task-select-btn" data-task-id="${task.id}">
              ${task.status === "evaluated" ? "View Review" : task.status === "submitted" ? "Submitted" : "Start Task"}
            </button>
          </div>
        </div>
      `).join("");

      container.querySelectorAll(".task-select-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tid = btn.dataset.taskId;
          const task = tasks.find(t => t.id === tid);
          if (task && task.status === "evaluated") {
            window.location.href = `/evaluation?task_id=${tid}`;
            return;
          }
          selectTask(tid, tasks);
        });
      });
      startCountdowns();
    }

    function selectTask(taskId, tasks) {
      activeTaskId = taskId;
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      document.querySelectorAll(".task-card").forEach(c => c.style.borderColor = "");
      const card = document.querySelector(`.task-card[data-task-id="${taskId}"]`);
      if (card) card.style.borderColor = "var(--color-primary)";

      document.getElementById("editor-panel").style.display = "block";
      document.getElementById("selected-task-title").textContent = task.title;
      document.getElementById("selected-task-desc").textContent = task.description || "";

      const editorArea = document.getElementById("code-editor");
      const textArea = document.getElementById("text-editor");

      if (task.task_type === "coding" || task.task_type === "bug_fix") {
        editorArea.style.display = "block";
        textArea.style.display = "none";
        initMonacoEditor();
      } else {
        editorArea.style.display = "none";
        textArea.style.display = "block";
        textArea.value = "";
      }

      document.getElementById("submit-task-btn").dataset.taskId = taskId;
      document.getElementById("submit-task-btn").disabled = task.status === "submitted" || task.status === "evaluated";
    }

    function initMonacoEditor() {
      if (monacoEditor) { monacoEditor.layout(); return; }
      if (typeof require === "undefined") {
        const editorArea = document.getElementById("code-editor");
        editorArea.innerHTML = '<textarea class="w-full h-[400px] bg-[#1C1C26] text-[#F0F0F5] border border-[#2a2a35] rounded-lg p-4 font-[\'JetBrains_Mono\',monospace] text-sm" placeholder="Write your code here..."></textarea>';
        return;
      }
      require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } });
      require(["vs/editor/editor.main"], function () {
        monacoEditor = monaco.editor.create(document.getElementById("code-editor"), {
          value: "// Write your solution here\n", language: "javascript", theme: "vs-dark",
          fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false,
          automaticLayout: true, padding: { top: 16 },
        });
      });
    }

    function showLoading(show) {
      const el = document.getElementById("loading-overlay");
      if (el) el.style.display = show ? "flex" : "none";
    }

    function startCountdowns() {
      countdownIntervals.forEach(i => clearInterval(i));
      countdownIntervals = [];
      document.querySelectorAll(".countdown-timer").forEach((el) => {
        const deadline = el.dataset.deadline;
        if (!deadline) return;
        function update() {
          const diff = new Date(deadline) - new Date();
          if (diff <= 0) { el.textContent = "OVERDUE"; el.classList.add("overdue"); return; }
          const hours = Math.floor(diff / 3600000);
          const minutes = Math.floor((diff % 3600000) / 60000);
          el.textContent = `${hours}h ${minutes}m`;
        }
        update();
        countdownIntervals.push(setInterval(update, 60000));
      });
    }

    document.addEventListener("click", async (e) => {
      const submitBtn = e.target.closest("#submit-task-btn");
      if (!submitBtn) return;
      const tid = submitBtn.dataset.taskId;
      if (!tid) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
      try {
        let content = "";
        const editorArea = document.getElementById("code-editor");
        const textArea = document.getElementById("text-editor");
        if (editorArea.style.display !== "none") {
          if (monacoEditor) content = monacoEditor.getValue();
          else content = editorArea.querySelector("textarea")?.value || "";
        } else {
          content = textArea.value;
        }
        if (!content.trim()) {
          showToast("Please write something before submitting", "error");
          submitBtn.disabled = false; submitBtn.textContent = "Submit Task"; return;
        }
        await api.post(`/tasks/${tid}/submit`, { content });
        showToast("Submitted! AI is reviewing...", "info");
        document.getElementById("evaluation-overlay").style.display = "flex";
        const evaluation = await pollUntilReady(async () => {
          try {
            const evalData = await api.get(`/tasks/${tid}/evaluation`);
            if (evalData.overall_score !== undefined) return { status: "completed", ...evalData };
            return { status: "processing" };
          } catch { return { status: "processing" }; }
        });
        document.getElementById("evaluation-overlay").style.display = "none";
        const sid = document.getElementById("session-id").dataset.sessionId;
        try { await api.post(`/simulations/${sid}/team-message`, { persona: "team_lead", trigger: "task_submitted", task_id: tid }); } catch (_) {}
        window.location.href = `/evaluation?task_id=${tid}`;
      } catch (err) {
        showToast(err.message, "error");
        submitBtn.disabled = false; submitBtn.textContent = "Submit Task";
        document.getElementById("evaluation-overlay").style.display = "none";
      }
    });

    async function loadTeamMessages(sid) {
      try { await api.post(`/simulations/${sid}/team-message`, { persona: "team_lead", trigger: "day_started", task_id: "" }); } catch (_) {}
      const chatContainer = document.getElementById("team-chat-messages");
      if (!chatContainer) return;
      const teamMessages = sessionData.team_messages || [
        { persona_name: "Priya", message: "Good morning team! Let's have a great day today 🚀", persona_role: "Team Lead" },
        { persona_name: "Karan", message: "Hey! Let me know if anyone needs help with the tasks.", persona_role: "Senior Dev" },
      ];
      chatContainer.innerHTML = teamMessages.map((msg) => `
        <div class="flex gap-2.5 p-3 rounded-[var(--radius-sm)] bg-white/[0.02]">
          <div class="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold shrink-0">${(msg.persona_name || "AI")[0]}</div>
          <div>
            <div class="flex gap-2 items-center mb-1">
              <strong class="text-xs">${msg.persona_name || "AI"}</strong>
              <span class="text-[var(--color-text-muted)] text-xs">${msg.persona_role || ""}</span>
            </div>
            <p class="text-xs m-0">${msg.message || ""}</p>
          </div>
        </div>
      `).join("");
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, []);

  return (
    <>
      <div id="navbar-placeholder"></div>
      <div id="sidebar-placeholder"></div>
      <div id="session-id" className="ml-[260px] pt-16 grid grid-cols-[300px_1fr] min-h-screen">
        <div className="team-chat-sidebar bg-[var(--color-surface)] border-r border-white/5 flex flex-col">
          <div className="px-4 py-4 border-b border-white/5 flex justify-between items-center">
            <h4 className="m-0">Team Chat</h4>
            <span className="text-xs text-[var(--color-success)]">● 4 online</span>
          </div>
          <div id="team-chat-messages" className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            <div className="text-center p-6 text-[var(--color-text-muted)] text-xs">Loading messages...</div>
          </div>
        </div>

        <div className="flex flex-col p-6 gap-4">
          <div className="task-board-header">
            <h3 id="session-title">Loading Simulation...</h3>
          </div>

          <div id="loading-tasks" className="hidden flex-col items-center gap-3 py-12 text-center">
            <div className="spinner spinner-lg"></div>
            <p>AI is generating your tasks for today...</p>
            <p className="text-xs text-[var(--color-text-muted)]">This usually takes a few seconds</p>
          </div>

          <div id="task-board" className="task-list flex flex-col gap-3">
            <div className="text-center p-8">
              <div className="spinner"></div>
              <p className="mt-3 text-[var(--color-text-muted)]">Loading tasks...</p>
            </div>
          </div>
        </div>
      </div>

      <div id="editor-panel" className="editor-panel hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-white/[0.08] px-6 py-4 z-[200]">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 id="selected-task-title" className="m-0">Select a task</h4>
            <p id="selected-task-desc" className="text-sm m-0 mt-1">Click on a task card to start working on it.</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div id="code-editor" className="hidden w-full h-[350px]"></div>
          <textarea id="text-editor" className="hidden w-full min-h-[120px] p-3 bg-[#1C1C26] text-[#F0F0F5] border border-[#2a2a35] rounded-lg font-['Inter',sans-serif] text-sm resize-y" placeholder="Write your response here..."></textarea>
          <button className="btn btn-primary" id="submit-task-btn" disabled>Submit Task</button>
        </div>
      </div>

      <div id="evaluation-overlay" className="evaluation-overlay hidden fixed inset-0 bg-black/85 z-[300] flex-col items-center justify-center gap-3">
        <div className="spinner spinner-lg"></div>
        <p>AI is reviewing your work...</p>
        <p className="text-xs text-[var(--color-text-muted)]">This usually takes a few seconds</p>
      </div>

      <div id="loading-overlay" className="loading-overlay hidden fixed inset-0 bg-black/85 z-[300] flex-col items-center justify-center gap-4">
        <div className="spinner spinner-lg"></div>
        <p>Loading simulation...</p>
      </div>
    </>
  );
}
