"use client";

import { ChevronRight, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_JOURNEYS } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { JOURNEY_STAGES } from "@/types";
import { cn } from "@/lib/utils";

const START_OPTIONS = [
  { type: "seed", emoji: "🌰", label: "From Seed", desc: "Start from the very beginning" },
  { type: "seedling", emoji: "🌱", label: "From Seedling", desc: "Already germinated" },
  { type: "cutting", emoji: "✂️", label: "From Cutting", desc: "Propagate from a cutting" },
  { type: "bulb", emoji: "🧅", label: "From Bulb / Tuber", desc: "Plant a bulb or tuber" },
];

const QUICK_LINKS = [
  { emoji: "🤖", label: "AI Grow Guide", desc: "Get personalized growing plans", href: "#" },
  { emoji: "👥", label: "Grow Community", desc: "Join grow journey discussions", href: "/community" },
];

export default function GrowPage() {
  const { data: journeys, loading } = useApi(
    () => api.getJourneys(),
    MOCK_JOURNEYS.map(j => ({ ...j, environmentType: null }))
  );

  const activeJourneys = (journeys || []).filter((j) => j.status === "active");

  return (
    <div className="page-container bottom-safe">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 animate-fade-in">
        <div>
          <h1 className="page-title">Grow Journey</h1>
          <p className="page-subtitle">Start from a seed, seedling, cutting, or bulb.</p>
        </div>
        <Link
          href="/grow/start"
          className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20"
        >
          <Plus size={20} className="text-white" />
        </Link>
      </div>

      {/* Loading */}
      {loading && <div className="mt-5"><CardSkeleton /></div>}

      {/* Active Journey */}
      {!loading && activeJourneys.map((journey) => (
        <section key={journey.id} className="mt-5 animate-slide-up">
          <h2 className="section-title mb-3">Active Journey</h2>
          <Link href={`/grow/${journey.id}`}>
            <div className="lufora-card-hover p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-soft to-[#F5EDE0] flex items-center justify-center text-2xl shrink-0">🌱</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-dark">{journey.plantName}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <Badge variant="primary">{journey.currentStage}</Badge>
                    <Badge variant="earth">{journey.startType}</Badge>
                    <span className="text-xs text-brand-muted">Day {journey.dayNumber}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-primary">{journey.progressPercent}%</span>
              </div>
              <ProgressBar value={journey.progressPercent} size="sm" showLabel label="Journey Progress" className="mb-3" />
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-brand-muted">🎯 {journey.pointsEarned} pts earned</span>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-soft text-brand-primary text-sm font-semibold">
                Continue <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        </section>
      ))}

      {/* No Active Journeys */}
      {!loading && activeJourneys.length === 0 && (
        <div className="mt-5 lufora-card p-6 text-center animate-fade-in">
          <span className="text-4xl block mb-3">🌱</span>
          <p className="text-sm font-medium text-brand-dark mb-1">No active journeys</p>
          <p className="text-xs text-brand-muted">Start a new grow journey below!</p>
        </div>
      )}

      {/* Stage Timeline */}
      <section className="mt-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <h2 className="section-title mb-3">Journey Stages</h2>
        <div className="lufora-card p-4">
          <div className="relative">
            {JOURNEY_STAGES.map((stage, i) => {
              const isCompleted = i < 3;
              const isActive = i === 3;
              return (
                <div key={stage.key} className="flex items-start gap-3 relative">
                  {i < JOURNEY_STAGES.length - 1 && (
                    <div className={cn("absolute left-[13px] top-7 w-0.5 h-full", isCompleted ? "bg-brand-primary" : "bg-surface-200")} />
                  )}
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold z-10 transition-all",
                    isCompleted ? "bg-brand-primary text-white" : isActive ? "border-2 border-brand-primary text-brand-primary bg-brand-soft" : "bg-surface-200 text-brand-muted"
                  )}>
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <div className={cn("pb-5", i === JOURNEY_STAGES.length - 1 && "pb-0")}>
                    <p className={cn("text-sm font-medium", isActive ? "text-brand-primary" : isCompleted ? "text-brand-dark" : "text-brand-muted")}>
                      {stage.emoji} {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Matchmaker */}
      <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <Link href="/matchmaker">
          <div className="lufora-card-hover p-4 border-brand-primary/30 bg-gradient-to-r from-brand-soft/40 to-transparent flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-brand-dark flex items-center gap-1.5 mb-0.5">
                <Sparkles size={16} className="text-brand-primary" />
                Not sure what to grow?
              </h2>
              <p className="text-[10px] text-brand-muted">Take our AI quiz to find your perfect plant match.</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-brand-primary shrink-0">
              <ChevronRight size={18} />
            </div>
          </div>
        </Link>
      </section>

      {/* Start Options */}
      <section className="mt-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="section-title mb-3">Start a New Journey</h2>
        <div className="grid grid-cols-2 gap-3">
          {START_OPTIONS.map((opt) => (
            <Link key={opt.type} href="/grow/start">
              <div className="lufora-card-hover p-3.5 text-center">
                <span className="text-3xl block mb-2">{opt.emoji}</span>
                <p className="text-sm font-semibold text-brand-dark">{opt.label}</p>
                <p className="text-[10px] text-brand-muted mt-0.5">{opt.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-6 mb-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        {QUICK_LINKS.map((link) => (
          <Link key={link.label} href={link.href}>
            <div className="lufora-card-hover p-3.5 flex items-center gap-3 mb-3">
              <span className="text-2xl">{link.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-dark">{link.label}</p>
                <p className="text-xs text-brand-muted">{link.desc}</p>
              </div>
              <ChevronRight size={18} className="text-brand-muted" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
