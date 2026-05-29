"use client";

import { useTheme as useThemeContext } from "@/components/ThemeProvider";

export function useTheme() {
  const ctx = useThemeContext();
  return {
    ...ctx,
    isDark: ctx.resolvedTheme === "dark",
    isLight: ctx.resolvedTheme === "light",
    toggleTheme: () => ctx.setTheme(ctx.resolvedTheme === "dark" ? "light" : "dark"),
    mounted: true,
  };
}
