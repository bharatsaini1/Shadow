"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ variant = "icon" }) {
  const { theme, setTheme } = useTheme();

  if (variant === "icon") {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
    return (
      <button
        onClick={() => setTheme(next)}
        className="btn-icon"
        title={`Theme: ${theme}`}
        aria-label="Toggle theme"
      >
        <Icon size={15} />
      </button>
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="inline-flex bg-paper-2 dark:bg-sheet rounded-md p-0.5 border border-rule-light dark:border-rule">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-body font-medium transition-all duration-150",
            theme === value
              ? "bg-white dark:bg-sheet-2 text-ink-prose dark:text-prose shadow-lift-light dark:shadow-lift"
              : "text-ink-ghost dark:text-ghost hover:text-ink-prose-2 dark:hover:text-prose-2"
          )}
          aria-pressed={theme === value}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  );
}
