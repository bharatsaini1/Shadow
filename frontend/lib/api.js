import { CONFIG } from "./config";

const BASE_URL = CONFIG.API_BASE_URL;

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

async function apiRequest(method, endpoint, body = null) {
  const headers = { "Content-Type": "application/json" };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrf = getCsrfToken();
    if (csrf) headers["X-CSRFToken"] = csrf;
  }

  const config = {
    method,
    headers,
    credentials: "include",
  };
  if (body) config.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error("Network error — please check your connection");
  }

  if (response.status === 401 && endpoint !== "/auth/login" && endpoint !== "/auth/register" && endpoint !== "/auth/google") {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("db_user_id");
      window.location.href = "/login";
    }
    return;
  }

  if (response.status === 204) return null;

  let data;
  const raw = await response.text();
  try {
    data = JSON.parse(raw);
  } catch (_) {
    if (!response.ok) {
      throw new Error(`Server error (${response.status}). Please try again.`);
    }
    throw new Error(`Unexpected response from server. Expected JSON but got: ${raw.slice(0, 200)}`);
  }

  if (!response.ok) {
    const message = data.detail || data.message || data.error || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (endpoint) => apiRequest("GET", endpoint),
  post: (endpoint, body) => apiRequest("POST", endpoint, body),
  put: (endpoint, body) => apiRequest("PUT", endpoint, body),
  delete: (endpoint) => apiRequest("DELETE", endpoint),
};
