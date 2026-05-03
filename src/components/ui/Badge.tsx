import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "primary" | "earth" | "success" | "warning" | "danger" | "info" | "neutral" | "premium";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-brand-soft text-brand-primary",
  earth: "bg-[#F5EDE0] text-brand-earth",
  success: "bg-brand-soft text-brand-primary",
  warning: "bg-brand-warning-light text-amber-700",
  danger: "bg-brand-danger-light text-red-700",
  info: "bg-brand-info-light text-brand-info",
  neutral: "bg-surface-100 text-brand-muted",
  premium: "bg-gradient-to-r from-amber-100 to-yellow-50 text-amber-700 border border-amber-200/50",
};

export default function Badge({ children, variant = "primary", className, icon }: BadgeProps) {
  return (
    <span className={cn("badge-pill", variantClasses[variant], className)}>
      {icon}
      {children}
    </span>
  );
}
