import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

const sizePx = { xs: 28, sm: 32, md: 40, lg: 48, xl: 64 };

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const bgColors = [
  "bg-brand-primary",
  "bg-brand-info",
  "bg-brand-earth",
  "bg-purple-500",
  "bg-pink-500",
  "bg-amber-500",
  "bg-teal-500",
];

export default function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const bgColor = bgColors[name.charCodeAt(0) % bgColors.length];

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn("rounded-full object-cover ring-2 ring-white", sizeClasses[size], className)}
      />
    );
  }

  return (
    <div className={cn("rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-white", sizeClasses[size], bgColor, className)}>
      {getInitials(name)}
    </div>
  );
}
