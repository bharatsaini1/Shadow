"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { getUrlParam, showToast, animateCountUp } from "@/lib/utils";

export default function InterviewPage() {
  useEffect(() => {
    let interviewId = null;
    let isComplete = false;

    interviewId = getUrlParam("interview_id");
    if (!interviewId) {
      showToast("No interview ID provided", "error");
      return;
    }

    document.getElementById("send-btn").addEventListener("click", sendMessage);
    document.getElementById("chat-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    addAIMessage("Hello! I'm Meera, your AI interviewer today. I'll be asking you a series of questions to assess your skills. Take your time with each answer. Let's begin!", "Meera, Interviewer");

    async function sendMessage() {
      if (isComplete) return;
      const input = document.getElementById("chat-input");
      const message = input.value.trim();
      if (!message) return;
      input.value = "";
      addUserMessage(message);
      showTypingIndicator(true);

      try {
        const result = await api.post(`/interviews/${interviewId}/message`, { content: message });
        showTypingIndicator(false);
        if (result.ai_response) addAIMessage(result.ai_response, "Meera, Interviewer");
        if (result.is_complete) {
          isComplete = true;
          document.getElementById("input-area").style.display = "none";
          document.getElementById("interview-complete").style.display = "flex";
          document.getElementById("view-dashboard-btn").addEventListener("click", () => window.location.href = "/dashboard");
          setTimeout(() => {
            const scorePanel = document.getElementById("score-reveal");
            scorePanel.classList.add("visible");
            if (result.overall_score !== undefined) {
              const scoreEl = document.getElementById("interview-score");
              animateCountUp(scoreEl, result.overall_score);
            }
            document.querySelectorAll(".interview-score-fill").forEach((bar) => {
              const score = parseInt(bar.dataset.score) || 0;
              setTimeout(() => { bar.style.width = `${score}%`; }, 500);
            });
          }, 1500);
          setTimeout(() => window.location.href = "/dashboard", 10000);
        }
      } catch (err) {
        showTypingIndicator(false);
        showToast(err.message, "error");
      }
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest("#end-interview-btn")) {
        if (confirm("Are you sure you want to end this interview?")) {
          api.post(`/interviews/${interviewId}/end`)
            .then((result) => {
              if (result.is_complete) {
                isComplete = true;
                document.getElementById("input-area").style.display = "none";
                document.getElementById("interview-complete").style.display = "flex";
              }
            }).catch((err) => showToast(err.message, "error"));
        }
      }
    });

    function addUserMessage(text) {
      const container = document.getElementById("chat-messages");
      const div = document.createElement("div");
      div.className = "message message-user flex justify-end mb-4";
      div.innerHTML = `<div class="message-bubble bg-[var(--color-primary)] text-white px-4 py-3 rounded-[12px_12px_4px_12px] max-w-[70%] text-sm">${escapeHtml(text)}</div>`;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function addAIMessage(text, sender) {
      const container = document.getElementById("chat-messages");
      const div = document.createElement("div");
      div.className = "message message-ai flex gap-3 mb-4";
      const avatar = sender ? sender[0] : "M";
      div.innerHTML = `
        <div class="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-semibold text-xs shrink-0">${avatar}</div>
        <div>
          <div class="text-xs text-[var(--color-text-muted)] mb-1">${sender || "AI Interviewer"}</div>
          <div class="message-bubble bg-[var(--color-surface-2)] text-[var(--color-text)] px-4 py-3 rounded-[12px_12px_12px_4px] max-w-[70%] text-sm">${escapeHtml(text)}</div>
        </div>`;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function showTypingIndicator(show) {
      const indicator = document.getElementById("typing-indicator");
      if (!indicator) return;
      indicator.style.display = show ? "flex" : "none";
      if (show) document.getElementById("chat-messages").scrollTop = document.getElementById("chat-messages").scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML.replace(/\n/g, "<br>");
    }
  }, []);

  return (
    <>
      <div className="max-w-[720px] mx-auto p-6 pt-[88px]">
        <div className="flex items-center gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5 mb-4">
          <div className="w-11 h-11 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-bold">M</div>
          <div>
            <h3 className="m-0">AI Interview</h3>
            <p className="m-0 text-xs text-[var(--color-text-muted)]">Interviewer: Meera • Technical</p>
          </div>
          <div className="ml-auto">
            <button className="btn btn-ghost btn-sm" id="end-interview-btn">End Interview</button>
          </div>
        </div>

        <div id="chat-messages" className="h-[400px] overflow-y-auto p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5 mb-4">
          <div className="message message-ai flex gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-semibold text-xs shrink-0">M</div>
            <div>
              <div className="text-xs text-[var(--color-text-muted)] mb-1">Meera, Interviewer</div>
              <div className="message-bubble bg-[var(--color-surface-2)] px-4 py-3 rounded-[12px_12px_12px_4px] max-w-[70%] text-sm">Hello! I'm Meera, your AI interviewer today. I'll be asking you a series of questions to assess your skills. Take your time with each answer. Let's begin!</div>
            </div>
          </div>
        </div>

        <div id="typing-indicator" className="hidden items-center gap-1.5 px-4 py-2 mb-4">
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" style={{animationDelay:"0.2s"}}></span>
          <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" style={{animationDelay:"0.4s"}}></span>
        </div>

        <div id="interview-complete" className="hidden flex-col items-center gap-3 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--color-success)] flex items-center justify-center text-2xl font-bold">✓</div>
          <h2>Interview Complete!</h2>
          <p>Great job! Let's see how you did.</p>
          <button className="btn btn-primary" id="view-dashboard-btn">View Dashboard</button>
        </div>

        <div id="score-reveal" className="hidden p-6 bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-white/5 mb-4">
          <h3 className="text-center mb-5">Your Interview Scores</h3>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold font-['Space_Grotesk'] text-[var(--color-primary)]" id="interview-score">0</div>
            <div className="text-[var(--color-text-muted)] text-sm">Overall Score</div>
          </div>
          <div className="flex flex-col gap-3">
            {["Technical","Communication","Confidence","Problem Solving","Cultural Fit"].map(s => (
              <div key={s} className="flex items-center gap-3">
                <span className="text-xs text-[var(--color-text-muted)] w-[130px] shrink-0">{s}</span>
                <div className="flex-1 h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-primary)] rounded-full w-0 transition-[width] duration-1000 ease-out interview-score-fill"></div>
                </div>
                <span className="text-xs font-semibold w-[30px] text-right">0</span>
              </div>
            ))}
          </div>
        </div>

        <div id="input-area" className="flex gap-2">
          <input type="text" id="chat-input" placeholder="Type your answer..." autoFocus className="flex-1 px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] border border-white/[0.06] text-[var(--color-text)] text-sm outline-none" />
          <button className="btn btn-primary" id="send-btn">Send</button>
        </div>
      </div>
    </>
  );
}
