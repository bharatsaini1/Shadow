"use client";

import { cn } from "@/lib/utils";

const variantMap = {
  live: "badge-live",
  active: "badge-active",
  paused: "badge-paused",
  done: "badge-done",
  overdue: "badge-overdue",
  hard: "badge-hard",
  medium: "badge-medium",
  easy: "badge-easy",
  interview: "badge-interview",
  neutral: "badge-neutral",
  plan: "badge-plan",
};

export default function Badge({ variant = "neutral", size = "sm", dot, children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-label text-2xs font-medium uppercase tracking-widest px-1.5 py-0.5 rounded-sm",
        variantMap[variant],
        size === "md" && "text-xs px-2 py-1",
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-[5px] h-[5px] rounded-full",
            variant === "live" && "animate-pulse-slow bg-go",
            variant === "active" && "bg-signal",
            variant === "done" && "bg-go",
            variant === "overdue" && "bg-stop",
          )}
        />
      )}
      {children}
    </span>
  );
}
