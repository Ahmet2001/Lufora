"use client";

import { Bell, CalendarDays, ChevronRight, Flame, Heart, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_USER, MOCK_PLANTS, MOCK_JOURNEYS, MOCK_COMMUNITY_POSTS, MOCK_CARE_TASKS } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { getGreeting, getHealthColor, getPlantEmoji, timeAgo } from "@/lib/utils";

export default function HomePage() {
  const { data: user, loading: userLoading } = useApi(
    () => api.getMe(),
    { ...MOCK_USER, totalPoints: MOCK_USER.points, _count: { plants: MOCK_USER.plantCount, growJourneys: MOCK_USER.activeJourneys, communityPosts: MOCK_USER.communityPosts } }
  );
  const { data: plants, loading: plantsLoading } = useApi(() => api.getPlants(), MOCK_PLANTS.map(p => ({ ...p, healthScore: p.latestHealthScore, status: "active" })));
  const { data: journeys } = useApi(() => api.getJourneys(), MOCK_JOURNEYS.map(j => ({ ...j, environmentType: null })));
  const { data: posts } = useApi(() => api.getPosts(), MOCK_COMMUNITY_POSTS.map(p => ({
    ...p, likesCount: p.likeCount, repliesCount: p.commentCount, author: { id: p.userId, name: p.userName, avatarUrl: p.userAvatar }
  })));
  const { data: tasks } = useApi(() => api.getTodayTasks(), MOCK_CARE_TASKS.map(t => ({
    ...t, description: t.description || null, plant: t.plantId ? { nickname: t.plantName, species: null } : null, journey: t.journeyId ? { plantName: t.plantName } : null
  })));

  const userName = user?.name || MOCK_USER.name;
  const streak = user?.streak ?? user?.currentStreak ?? MOCK_USER.streak;
  const attentionPlant = plants?.reduce((min, p) => (!min || p.healthScore < min.healthScore) ? p : min, null as typeof plants[0] | null);
  const attentionPlantBelow80 = attentionPlant && attentionPlant.healthScore < 80 ? attentionPlant : null;
  const activeJourney = journeys?.find((j) => j.status === "active");
  const trendingPosts = (posts || []).slice(0, 2);
  const pendingTasks = (tasks || []).filter(t => !t.completedAt);

  if (userLoading && plantsLoading) {
    return (
      <div className="page-container bottom-safe">
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container bottom-safe">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Avatar name={userName} size="lg" />
          <div>
            <h1 className="font-display text-xl font-bold text-brand-dark">
              {getGreeting()}, {userName.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm text-brand-muted">
              {pendingTasks.length > 0 ? `${pendingTasks.length} task${pendingTasks.length !== 1 ? "s" : ""} remaining today.` : "All caught up! 🎉"}
            </p>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white border border-surface-200 flex items-center justify-center shadow-card">
          <Bell size={18} className="text-brand-muted" />
          {pendingTasks.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-brand-danger text-[9px] text-white font-bold flex items-center justify-center">{pendingTasks.length}</span>
          )}
        </button>
      </header>

      {/* Today's Care Summary */}
      <section className="mb-5 animate-slide-up">
        <div className="lufora-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-soft flex items-center justify-center">
              <CalendarDays size={16} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-brand-dark">Today&apos;s Care Summary</h2>
              <p className="text-xs text-brand-muted">{pendingTasks.length} tasks remaining</p>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-2.5 text-sm">
                <span className="text-base">{task.type === "water" ? "💧" : task.type === "prune" ? "✂️" : "🔍"}</span>
                <span className="text-brand-dark truncate">{task.title}</span>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-sm text-brand-muted text-center py-2">No tasks for today! 🎉</p>
            )}
          </div>
          <Link
            href="/calendar"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-soft text-brand-primary text-sm font-semibold transition-all hover:bg-brand-primary/10"
          >
            View Tasks
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Plant Needing Attention */}
      {attentionPlantBelow80 && (
        <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="section-title mb-3">Needs Attention</h2>
          <Link href={`/plants/${attentionPlantBelow80.id}`}>
            <div className="lufora-card-hover p-4">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center text-2xl shrink-0">
                  {getPlantEmoji(attentionPlantBelow80.nickname || attentionPlantBelow80.species || "plant")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-brand-dark">{attentionPlantBelow80.nickname}</p>
                    <div className={`text-sm font-bold ${getHealthColor(attentionPlantBelow80.healthScore)}`}>
                      {attentionPlantBelow80.healthScore}/100
                    </div>
                  </div>
                  <p className="text-xs text-brand-muted mb-1.5">{attentionPlantBelow80.species}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-brand-danger-light text-brand-danger text-sm font-semibold">
                <Sparkles size={14} />
                Open Plant Doctor
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Active Grow Journey */}
      {activeJourney && (
        <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="section-title mb-3">Active Grow Journey</h2>
          <Link href={`/grow/${activeJourney.id}`}>
            <div className="lufora-card-hover p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-soft to-[#F5EDE0] flex items-center justify-center text-2xl shrink-0">
                  🌱
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-brand-dark">{activeJourney.plantName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant="primary">{activeJourney.currentStage}</Badge>
                    <Badge variant="earth">{activeJourney.startType}</Badge>
                    <span className="text-xs text-brand-muted">Day {activeJourney.dayNumber}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-primary">{activeJourney.progressPercent}%</span>
              </div>
              <ProgressBar value={activeJourney.progressPercent} size="sm" className="mb-2.5" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-muted">🎯 {activeJourney.pointsEarned} pts earned</span>
                <span className="text-brand-primary font-medium">Continue →</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Weekly Streak */}
      <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="lufora-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={20} className="text-orange-500" />
            <h2 className="text-sm font-semibold text-brand-dark">{streak}-Day Streak!</h2>
          </div>
          <div className="flex items-center justify-between mb-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < streak
                      ? "bg-brand-primary text-white shadow-sm"
                      : i === streak
                      ? "border-2 border-dashed border-brand-primary/40 text-brand-primary"
                      : "bg-surface-100 text-brand-muted"
                  }`}
                >
                  {i < streak ? "✓" : i + 1}
                </div>
                <span className="text-[10px] text-brand-muted font-medium">{day}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-brand-muted text-center">Complete {Math.max(0, 7 - streak)} more days to unlock a bonus badge. 🔥</p>
        </div>
      </section>

      {/* Trending in Community */}
      <section className="mb-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Trending in Community</h2>
          <Link href="/community" className="text-xs font-medium text-brand-primary">See all →</Link>
        </div>
        <div className="space-y-3">
          {trendingPosts.map((post) => (
            <Link key={post.id} href="/community">
              <div className="lufora-card-hover p-3.5 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={post.author?.name || "Lufora User"} size="xs" />
                  <span className="text-xs font-medium text-brand-dark">{post.author?.name || "Lufora User"}</span>
                  <span className="text-[10px] text-brand-muted">{timeAgo(post.createdAt)}</span>
                </div>
                <p className="text-sm font-medium text-brand-dark mb-2 line-clamp-2">{post.title}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-brand-muted">
                    <Heart size={13} /> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-brand-muted">
                    <MessageCircle size={13} /> {post.repliesCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
