import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-brand-primary hover:bg-brand-primary-dark shadow-md shadow-brand-primary/20",
  secondary:
    "text-brand-primary bg-brand-soft border border-brand-primary/15 hover:bg-brand-primary/10",
  ghost:
    "text-brand-muted hover:bg-surface-100",
  danger:
    "text-white bg-brand-danger hover:bg-red-500 shadow-md shadow-brand-danger/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "py-2 px-3.5 text-xs rounded-lg gap-1.5",
  md: "py-3 px-5 text-sm rounded-xl gap-2",
  lg: "py-3.5 px-6 text-base rounded-xl gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold",
        "active:scale-[0.98] transition-all duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? icon : null}
      {children}
    </button>
  );
}
