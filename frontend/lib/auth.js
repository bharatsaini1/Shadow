import { api } from "./api";

export async function register(email, password, name) {
  const response = await api.post("/auth/register", {
    email,
    password,
    name,
  });
  localStorage.setItem("auth_token", response.token);
  localStorage.setItem("db_user_id", response.user_id);
  return response;
}

export async function login(email, password) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("auth_token", response.token);
  localStorage.setItem("db_user_id", response.user_id);
  return response;
}

export function logout() {
  localStorage.clear();
  window.location.href = "/";
}

export function getUserId() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("db_user_id");
  }
  return null;
}
