import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function pollUntilReady(checkFn, intervalMs = 2000, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await checkFn();
    if (result.status === "completed" || result.overall_score !== undefined) return result;
    if (result.status === "failed") throw new Error("Processing failed");
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Timeout waiting for result");
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function sanitizeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function getXpForLevel(level) {
  return level * 1000 + (level - 1) * 500;
}

export function getUrlParam(name) {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer && typeof document !== "undefined") {
    toastContainer = document.createElement("div");
    toastContainer.className = "fixed bottom-6 right-6 z-[100] flex flex-col gap-2";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = "info") {
  if (typeof document === "undefined") return;
  const container = ensureToastContainer();
  const colors = {
    success: "bg-go/10 text-go border-go/20",
    error: "bg-stop/10 text-stop border-stop/20",
    info: "bg-signal/10 text-signal border-signal/20",
    warning: "bg-caution/10 text-caution border-caution/20",
  };

  const toast = document.createElement("div");
  toast.className = `font-body text-sm px-4 py-2.5 rounded-md border shadow-float-light dark:shadow-float animate-enter-right ${colors[type] || colors.info}`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function animateCountUp(target, duration = 1200, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
          resolve(current);
        }
      }, duration / (target / step));
    }, delay);
  });
}
