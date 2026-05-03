import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  emoji = "🌿",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <span className="text-5xl mb-4">{emoji}</span>
      <h3 className="font-display font-semibold text-lg text-surface-800 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-surface-500 max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
