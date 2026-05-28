import { CONFIG } from "./config";

const BASE_URL = CONFIG.API_BASE_URL;

function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export async function apiRequest(method, endpoint, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err) {
    throw new Error("Network error — please check your connection");
  }

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
    return;
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

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
