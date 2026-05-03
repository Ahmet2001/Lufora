import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-xl", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="lufora-card p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export function PlantCardSkeleton() {
  return (
    <div className="lufora-card overflow-hidden animate-pulse">
      <Skeleton className="h-28 rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="lufora-card p-3.5 flex items-center gap-3 animate-pulse">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );
}

export function PageLoadingSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <span className="text-4xl mb-3">😕</span>
      <h3 className="font-display font-semibold text-lg text-brand-dark mb-1">Something went wrong</h3>
      <p className="text-sm text-brand-muted max-w-xs mb-4">{message || "We couldn't load this data. Please try again."}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-sm active:scale-[0.97] transition-all">
          Try Again
        </button>
      )}
    </div>
  );
}

export function NotFoundState({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <span className="text-5xl mb-4">🔍</span>
      <h3 className="font-display font-semibold text-lg text-brand-dark mb-1">{title || "Not Found"}</h3>
      <p className="text-sm text-brand-muted max-w-xs">{description || "The item you're looking for doesn't exist or has been removed."}</p>
    </div>
  );
}
