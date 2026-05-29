"use client";

import { cn } from "@/lib/utils";

export default function Input({
  label,
  error,
  hint,
  leadingIcon,
  trailingIcon,
  trailingAction,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  size = "md",
  rows,
  className,
  ...props
}) {
  const inputClass = cn(
    "input",
    error && "input-error",
    leadingIcon && "pl-9",
    trailingAction && "pr-10",
    className
  );

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-label text-xs text-ghost uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ghost">
            {leadingIcon}
          </div>
        )}
        {rows ? (
          <textarea
            rows={rows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(inputClass, "resize-none min-h-[80px]")}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
            {...props}
          />
        )}
        {trailingAction && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {trailingAction}
          </div>
        )}
        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ghost">
            {trailingIcon}
          </div>
        )}
      </div>
      {error && <span className="font-mono text-xs text-stop mt-0.5">{error}</span>}
      {hint && !error && <span className="font-mono text-xs text-ghost mt-0.5">{hint}</span>}
    </div>
  );
}
