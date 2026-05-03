"use client";

import { useState } from "react";
import { ArrowLeft, Award, Crown, Medal } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_LEADERBOARD } from "@/lib/mock-data";
import { api, ApiLeaderboardEntry } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

const PERIODS = ["Weekly", "Monthly"] as const;
const CATEGORIES = ["Overall", "Most Tasks", "Most Helpful", "Best Journey"] as const;

const fallbackData: ApiLeaderboardEntry[] = MOCK_LEADERBOARD.map((u, i) => ({
  id: `user_${i + 1}`,
  name: u.name,
  avatarUrl: u.avatarUrl,
  totalPoints: u.points,
  level: Math.floor(u.points / 200) + 1,
  _count: { plants: 0, communityPosts: 0 },
  rank: u.rank,
  isCurrentUser: u.isCurrentUser,
}));

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<typeof PERIODS[number]>("Weekly");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Overall");

  const { data: leaderboard, loading } = useApi(
    () => api.getLeaderboard(period.toLowerCase()),
    fallbackData,
    [period]
  );

  const entries = (leaderboard || []).map((entry, i) => ({
    ...entry,
    rank: entry.rank || i + 1,
  }));

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Find current user — in real data we'd match by user ID, for now use mock flag or position 5
  const currentUser = (entries as (ApiLeaderboardEntry & { isCurrentUser?: boolean })[]).find(
    u => (u as { isCurrentUser?: boolean }).isCurrentUser
  ) || entries[4];

  return (
    <div className="page-container bottom-safe">
      <div className="flex items-center gap-3 mb-5 animate-fade-in">
        <Link href="/profile" className="p-2 -ml-2 rounded-xl hover:bg-surface-100 transition-colors">
          <ArrowLeft size={20} className="text-brand-dark" />
        </Link>
        <h1 className="page-title">Leaderboard</h1>
      </div>

      {/* Period Toggle */}
      <div className="flex gap-1.5 mb-4 bg-surface-100 p-1 rounded-xl animate-slide-up">
        {PERIODS.map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={cn("tab-btn flex-1 text-center", period === p ? "tab-btn-active" : "tab-btn-inactive")}>
            {p}
          </button>
        ))}
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 -mx-5 px-5 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={cn("chip", category === cat && "chip-active")}>
            {cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {!loading && entries.length > 0 && (
        <>
          {/* Current User Rank */}
          {currentUser && (
            <div className="lufora-card p-3.5 mb-5 border-brand-primary/30 bg-brand-soft/30 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-brand-primary w-8 text-center">#{currentUser.rank}</span>
                <Avatar name={currentUser?.name || "User"} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-brand-dark">You</p>
                  <p className="text-xs text-brand-muted">{currentUser.totalPoints} pts</p>
                </div>
                <Badge variant="primary">Your Rank</Badge>
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-6 animate-scale-in" style={{ animationDelay: "0.15s" }}>
              {/* 2nd */}
              <div className="flex flex-col items-center w-24">
                <Avatar name={top3[1]?.name || "User"} size="lg" className="mb-2" />
                <div className="w-full bg-surface-200 rounded-t-xl pt-3 pb-2 text-center">
                  <Medal size={18} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs font-semibold text-brand-dark truncate px-1">{(top3[1]?.name || "User").split(" ")[0]}</p>
                  <p className="text-[10px] text-brand-muted">{top3[1].totalPoints} pts</p>
                </div>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center w-28">
                <Crown size={24} className="text-amber-500 mb-1" />
                <Avatar name={top3[0]?.name || "User"} size="xl" className="mb-2 ring-4 ring-amber-200" />
                <div className="w-full bg-gradient-to-b from-amber-50 to-amber-100 rounded-t-xl pt-3 pb-2 text-center border border-amber-200/50">
                  <p className="text-sm font-bold text-brand-dark truncate px-1">{(top3[0]?.name || "User").split(" ")[0]}</p>
                  <p className="text-xs text-brand-earth font-semibold">{top3[0].totalPoints} pts</p>
                </div>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center w-24">
                <Avatar name={top3[2]?.name || "User"} size="lg" className="mb-2" />
                <div className="w-full bg-surface-200 rounded-t-xl pt-3 pb-2 text-center">
                  <Award size={18} className="mx-auto text-amber-600 mb-1" />
                  <p className="text-xs font-semibold text-brand-dark truncate px-1">{(top3[2]?.name || "User").split(" ")[0]}</p>
                  <p className="text-[10px] text-brand-muted">{top3[2].totalPoints} pts</p>
                </div>
              </div>
            </div>
          )}

          {/* Rest of List */}
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            {rest.map((user) => {
              const isCurrent = (user as { isCurrentUser?: boolean }).isCurrentUser;
              return (
                <div key={user.rank} className={cn("lufora-card p-3.5 flex items-center gap-3", isCurrent && "border-brand-primary/30 bg-brand-soft/20")}>
                  <span className="text-sm font-bold text-brand-muted w-6 text-center">{user.rank}</span>
                  <Avatar name={user?.name || "User"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isCurrent ? "text-brand-primary font-semibold" : "text-brand-dark")}>
                      {user?.name || "User"} {isCurrent && "(You)"}
                    </p>
                    <p className="text-[10px] text-brand-muted">Level {user.level}</p>
                  </div>
                  <span className="text-sm font-bold text-brand-dark">{user.totalPoints}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && entries.length === 0 && (
        <div className="lufora-card p-6 text-center animate-fade-in">
          <span className="text-4xl block mb-2">🏆</span>
          <p className="text-sm font-medium text-brand-dark">No leaderboard data yet</p>
          <p className="text-xs text-brand-muted">Complete tasks to start climbing the ranks!</p>
        </div>
      )}
    </div>
  );
}
