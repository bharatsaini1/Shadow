"use client";

import { cn } from "@/lib/utils";

const colorMap = {
  signal: "bg-signal",
  go: "bg-go",
  caution: "bg-caution",
  stop: "bg-stop",
};

const heightMap = {
  px: "h-px",
  sm: "h-0.5",
  base: "h-1",
};

export default function ProgressBar({
  value = 0,
  color = "signal",
  height = "sm",
  animated = false,
  label,
  showValue = false,
  className,
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="font-label text-2xs text-ghost uppercase tracking-widest">{label}</span>}
          {showValue && <span className="font-mono text-xs text-prose-2">{value}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-rule rounded-full overflow-hidden", heightMap[height])}>
        <div
          className={cn(
            "rounded-full transition-all duration-500",
            colorMap[color],
            heightMap[height],
            animated && "animate-bar-fill"
          )}
          style={{
            width: `${Math.min(value, 100)}%`,
            ...(animated ? { "--bar-w": `${Math.min(value, 100)}%` } : {}),
          }}
        />
      </div>
    </div>
  );
}
