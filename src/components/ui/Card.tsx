import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-5",
};

export default function Card({
  children,
  className,
  hoverable = false,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-surface-200 shadow-card",
        "transition-all duration-200",
        hoverable && "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        onClick && "cursor-pointer active:scale-[0.99]",
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
