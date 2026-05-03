"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Flame, Leaf, MessageCircle, Sprout, Trophy, Heart } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { timeAgo, getPlantEmoji } from "@/lib/utils";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: profile, loading, error } = useApi(
    () => api.getPublicProfile(id),
    null, // No fallback data, we want to show loading/error
    [id]
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-dark rounded-full hover:bg-surface-100">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-surface-200 animate-pulse mb-3" />
          <div className="h-6 w-32 bg-surface-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-surface-200 rounded animate-pulse" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-container">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-dark rounded-full hover:bg-surface-100">
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="lufora-card p-6 text-center">
          <span className="text-4xl block mb-2">🌿</span>
          <p className="text-sm font-medium text-brand-dark">Profile not found</p>
        </div>
      </div>
    );
  }

  const { user, isPrivate, badges, plants, posts } = profile;

  return (
    <div className="page-container bottom-safe">
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-dark rounded-full hover:bg-surface-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl font-bold text-brand-dark">Profile</h1>
      </div>

      <div className="flex flex-col items-center text-center mb-6 animate-slide-up">
        <Avatar name={user.name} size="xl" className="mb-3 ring-4 ring-brand-soft" />
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
          {user.name}
          {isPrivate && <Lock size={14} className="text-brand-muted" />}
        </h2>
        {user.bio && <p className="text-sm text-brand-muted mt-1 max-w-xs">{user.bio}</p>}
        {!isPrivate && user.level !== undefined && (
          <div className="flex items-center gap-1.5 mt-3">
            <Badge variant="primary">⭐ Level {user.level}</Badge>
          </div>
        )}
      </div>

      {isPrivate ? (
        <div className="lufora-card p-8 text-center animate-fade-in">
          <Lock size={32} className="mx-auto text-brand-muted mb-3" />
          <h3 className="text-base font-semibold text-brand-dark mb-1">This profile is private</h3>
          <p className="text-sm text-brand-muted">
            The user has chosen not to display their plants, journeys, and stats publicly.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: <Trophy size={16} />, label: "Points", value: user.totalPoints },
              { icon: <Flame size={16} className="text-orange-500" />, label: "Streak", value: `${user.currentStreak}d` },
              { icon: <Leaf size={16} className="text-brand-primary" />, label: "Plants", value: user.stats?.plants || 0 },
              { icon: <Sprout size={16} className="text-brand-earth" />, label: "Journeys", value: user.stats?.growJourneys || 0 },
            ].map((stat) => (
              <div key={stat.label} className="lufora-card p-2.5 text-center">
                <div className="flex justify-center mb-1 text-brand-dark">{stat.icon}</div>
                <p className="text-base font-bold text-brand-dark">{stat.value}</p>
                <p className="text-[9px] text-brand-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Badges Preview */}
          {badges && badges.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-brand-dark mb-3">Recent Badges</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {badges.map((b) => (
                  <div key={b.id} className="flex flex-col items-center gap-1 min-w-[64px]">
                    <div className="w-13 h-13 rounded-full bg-brand-soft border-2 border-brand-primary/30 flex items-center justify-center text-2xl shadow-sm">
                      {b.iconEmoji || b.icon || "🏅"}
                    </div>
                    <span className="text-[10px] font-medium text-brand-dark text-center leading-tight truncate w-full">{b.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Plants Preview */}
          {plants && plants.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-brand-dark mb-3">Public Collection</h3>
              <div className="grid grid-cols-2 gap-3">
                {plants.map((plant) => (
                  <div key={plant.id} className="lufora-card p-3 flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">{getPlantEmoji(plant.nickname || plant.species || "plant")}</span>
                    <p className="text-xs font-semibold text-brand-dark truncate w-full">{plant.nickname}</p>
                    {plant.species && <p className="text-[10px] text-brand-muted truncate w-full">{plant.species}</p>}
                    <div className="mt-2 w-full">
                      <div className="flex justify-between text-[9px] mb-1">
                        <span className="text-brand-muted">Health</span>
                        <span className="font-semibold text-brand-dark">{plant.healthScore}%</span>
                      </div>
                      <ProgressBar value={plant.healthScore} color={plant.healthScore >= 80 ? "primary" : plant.healthScore >= 50 ? "warning" : "danger"} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Posts Preview */}
          {posts && posts.length > 0 && (
            <section>
              <h3 className="text-sm font-bold text-brand-dark mb-3">Recent Discussions</h3>
              <div className="space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="lufora-card p-3">
                    <h4 className="text-sm font-medium text-brand-dark line-clamp-1 mb-1.5">{post.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-brand-muted">{timeAgo(post.createdAt)}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-brand-muted"><Heart size={10} /> {post.likesCount}</span>
                        <span className="flex items-center gap-1 text-[10px] text-brand-muted"><MessageCircle size={10} /> {post.repliesCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
