"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  icon: "btn-icon",
};

const sizes = {
  xs: "text-xs px-2 py-1",
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-sm px-5 py-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth,
  onClick,
  children,
  className,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-150 select-none",
        "active:scale-[0.97]",
        variants[variant],
        variant !== "icon" && sizes[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-40 pointer-events-none cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </button>
  );
}
