import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return d.toLocaleDateString();
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "text-brand-primary";
  if (score >= 60) return "text-brand-warning";
  if (score >= 40) return "text-brand-earth";
  return "text-brand-danger";
}

export function getHealthBg(score: number): string {
  if (score >= 80) return "bg-brand-soft";
  if (score >= 60) return "bg-brand-warning-light";
  if (score >= 40) return "bg-[#FDF0E6]";
  return "bg-brand-danger-light";
}

export function getHealthLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Healthy";
  if (score >= 55) return "Needs Attention";
  if (score >= 40) return "Struggling";
  return "Critical";
}

export function progressPercent(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getPlantEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("monstera")) return "🌿";
  if (lower.includes("snake")) return "🪴";
  if (lower.includes("cactus")) return "🌵";
  if (lower.includes("orchid")) return "🌸";
  if (lower.includes("basil")) return "🌱";
  if (lower.includes("tomato")) return "🍅";
  if (lower.includes("fern")) return "🌿";
  if (lower.includes("fig")) return "🍃";
  if (lower.includes("pothos")) return "💚";
  if (lower.includes("avocado")) return "🥑";
  const emojis = ["🌿", "🌱", "🍃", "🪴", "🌻"];
  return emojis[name.charCodeAt(0) % emojis.length];
}
