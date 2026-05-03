import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white",
            "text-surface-900 placeholder:text-surface-400",
            "focus:outline-none focus:ring-2 focus:ring-leaf-500/30 focus:border-leaf-500",
            "transition-all duration-200",
            icon && "pl-11",
            error
              ? "border-red-400 focus:ring-red-500/30 focus:border-red-500"
              : "border-surface-200",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
