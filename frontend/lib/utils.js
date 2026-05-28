export async function pollUntilReady(checkFn, intervalMs = 2000, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await checkFn();
    if (result.status === "completed" || result.overall_score !== undefined) return result;
    if (result.status === "failed") throw new Error("Processing failed");
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error("Timeout waiting for result");
}

export function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add("visible");
  });
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function animateCountUp(element, targetValue, duration = 1000) {
  const startTime = performance.now();
  const startValue = 0;

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(eased * targetValue);
    element.textContent = currentValue;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = targetValue;
    }
  }

  requestAnimationFrame(step);
}

export function getUrlParam(name) {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }
  return null;
}

export function getXpForLevel(level) {
  return 100 * Math.pow(level, 1.5);
}
