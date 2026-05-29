"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
});

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [resolvedTheme, setResolved] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("ms_theme");
    if (saved === "light" || saved === "dark" || saved === "system") {
      setThemeState(saved);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const resolved = theme === "system" ? getSystemTheme() : theme;
    html.classList.toggle("dark", resolved === "dark");
    setResolved(resolved);
    localStorage.setItem("ms_theme", theme);

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const sys = getSystemTheme();
        html.classList.toggle("dark", sys === "dark");
        setResolved(sys);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = useCallback((t) => setThemeState(t), []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
