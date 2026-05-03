import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "warning" | "danger" | "info";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const sizeClasses = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

const colorClasses = {
  primary: "bg-brand-primary",
  warning: "bg-brand-warning",
  danger: "bg-brand-danger",
  info: "bg-brand-info",
};

function getAutoColor(value: number): string {
  if (value >= 70) return colorClasses.primary;
  if (value >= 40) return colorClasses.warning;
  return colorClasses.danger;
}

export default function ProgressBar({ value, size = "md", color, showLabel = false, label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const barColor = color ? colorClasses[color] : getAutoColor(clamped);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-brand-muted">{label || "Progress"}</span>
          <span className="text-xs font-semibold text-brand-dark">{clamped}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-surface-200/80 overflow-hidden", sizeClasses[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
