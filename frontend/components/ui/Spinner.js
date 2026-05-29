"use client";

import { cn } from "@/lib/utils";

const sizeMap = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-8 h-8" };

export default function Spinner({ size = "md", color = "default" }) {
  return (
    <div
      className={cn(
        "rounded-full border-2 animate-spin",
        sizeMap[size],
        color === "white"
          ? "border-white/30 border-t-white"
          : "border-rule-2 border-t-transparent"
      )}
    />
  );
}
