import { api } from "./api";

function sanitize(str) {
  if (typeof str !== "string") return str;
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export async function register(email, password, name) {
  const response = await api.post("/auth/register", {
    email: sanitize(email),
    password,
    name: sanitize(name),
  });
  if (typeof window !== "undefined" && response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("db_user_id", response.user_id || response.user?.id || "");
  }
  return response;
}

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });
  if (typeof window !== "undefined" && response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("db_user_id", response.user_id || response.user?.id || "");
  }
  return response;
}

export async function loginWithGoogle(credential) {
  const response = await api.post("/auth/google", { credential });
  if (typeof window !== "undefined" && response.user) {
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("db_user_id", response.user_id || response.user?.id || "");
  }
  return response;
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch (_) {}
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("db_user_id");
    window.location.href = "/login";
  }
}

export function getUserId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("db_user_id");
  }
  return null;
}

export function getUser() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function isAuthenticated() {
  if (typeof document !== "undefined") {
    return document.cookie.split(";").some((c) => c.trim().startsWith("sessionid="));
  }
  return false;
}

export function getUserName() {
  const user = getUser();
  return user?.name || "Student";
}
