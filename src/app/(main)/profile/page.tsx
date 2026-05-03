"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Crown, Flame, HelpCircle, Leaf, LogOut, Settings, Sprout, Star, Trophy, Globe, Lock } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_USER, MOCK_BADGES } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: profile, loading } = useApi(
    () => api.getProfile(),
    {
      ...MOCK_USER,
      totalPoints: MOCK_USER.points,
      badges: MOCK_BADGES.filter(b => b.earned).map(b => ({
        badge: { ...b, category: "general", requiredCount: 1 },
        awardedAt: b.awardedAt || new Date().toISOString(),
      })),
    }
  );
  const { data: allBadges } = useApi(
    () => api.getAllBadges(),
    MOCK_BADGES.map(b => ({ ...b, category: "general", requiredCount: 1 }))
  );

  const [isPublic, setIsPublic] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile && profile.isPublicProfile !== undefined) {
      setIsPublic(profile.isPublicProfile);
    }
  }, [profile]);

  const togglePublicProfile = async () => {
    if (updating || !profile) return;
    setUpdating(true);
    try {
      await api.updateProfile({ isPublicProfile: !isPublic });
      setIsPublic(!isPublic);
    } catch (err) {
      console.error("Failed to update profile privacy", err);
    } finally {
      setUpdating(false);
    }
  };

  const user = profile || { ...MOCK_USER, totalPoints: MOCK_USER.points, badges: [] };
  const earnedBadgeIds = new Set((user.badges || []).map(b => b?.badge?.id).filter(Boolean));
  const earnedBadges = (user.badges || []).map(b => b?.badge).filter(Boolean);
  const lockedBadges = (allBadges || []).filter(b => !earnedBadgeIds.has(b.id));

  if (loading) {
    return (
      <div className="page-container bottom-safe">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-surface-200 animate-pulse mb-3" />
          <div className="h-6 w-32 bg-surface-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-40 bg-surface-200 rounded animate-pulse" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="page-container bottom-safe">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
        <Avatar name={user?.name || "Ada Green"} size="xl" className="mb-3 ring-4 ring-brand-soft" />
        <h1 className="page-title">{user?.name || "Ada Green"}</h1>
        <p className="text-sm text-brand-muted">{user.email}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <Badge variant="primary">⭐ Level {user.level}</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5 animate-slide-up">
        {[
          { icon: <TrophyIcon />, label: "Points", value: user.totalPoints },
          { icon: <Flame size={16} className="text-orange-500" />, label: "Streak", value: `${user?.streak ?? user?.currentStreak ?? 0}d` },
          { icon: <Leaf size={16} className="text-brand-primary" />, label: "Plants", value: user._count?.plants ?? MOCK_USER.plantCount },
          { icon: <Sprout size={16} className="text-brand-earth" />, label: "Journeys", value: user._count?.growJourneys ?? MOCK_USER.activeJourneys },
        ].map((stat) => (
          <div key={stat.label} className="lufora-card p-2.5 text-center">
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="text-base font-bold text-brand-dark">{stat.value}</p>
            <p className="text-[9px] text-brand-muted font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="lufora-card p-4 mb-5 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-brand-dark">Level {user.level}</span>
          <span className="text-xs text-brand-muted">{user.totalPoints} / 1000 XP</span>
        </div>
        <ProgressBar value={(user.totalPoints / 1000) * 100} color="primary" />
        <p className="text-xs text-brand-muted mt-2">Earn {Math.max(0, 1000 - user.totalPoints)} more points to reach Level {user.level + 1}</p>
      </div>

      {/* Badges */}
      <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="section-title mb-3">My Badges ({earnedBadges.length}/{(allBadges || []).length})</h2>
        <div className="flex gap-3 flex-wrap">
          {earnedBadges.map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-1 w-16">
              <div className="w-13 h-13 rounded-full bg-brand-soft border-2 border-brand-primary/30 flex items-center justify-center text-2xl shadow-sm">
                {b?.iconEmoji || b?.icon || "🏅"}
              </div>
              <span className="text-[10px] font-medium text-brand-dark text-center leading-tight">{b?.name || "Badge"}</span>
            </div>
          ))}
          {lockedBadges.map((b) => (
            <div key={b.id} className="flex flex-col items-center gap-1 w-16 opacity-35">
              <div className="w-13 h-13 rounded-full bg-surface-100 border-2 border-surface-200 flex items-center justify-center text-2xl grayscale">
                {b?.iconEmoji || b?.icon || "🏅"}
              </div>
              <span className="text-[10px] font-medium text-brand-muted text-center leading-tight">{b?.name || "Badge"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Card */}
      <section className="mb-5 animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <div className="lufora-card p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200/50 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-200/20 rounded-full" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-amber-600" />
              <h3 className="font-display font-bold text-brand-dark">Lufora Premium</h3>
            </div>
            <p className="text-sm text-brand-muted mb-3 leading-relaxed">
              Unlock unlimited plants, advanced AI Plant Doctor, AI Grow Guide, and detailed health insights.
            </p>
            <button className="w-full py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all">
              Explore Premium ✨
            </button>
          </div>
        </div>
      </section>

      {/* Menu & Settings */}
      <div className="space-y-1.5 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {/* Privacy Toggle */}
        <div className="lufora-card p-4 flex flex-col gap-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPublic ? <Globe size={18} className="text-brand-info" /> : <Lock size={18} className="text-brand-muted" />}
              <span className="text-sm font-medium text-brand-dark">Public Profile</span>
            </div>
            <button 
              onClick={togglePublicProfile} 
              disabled={updating}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative", 
                isPublic ? "bg-brand-primary" : "bg-surface-200",
                updating && "opacity-50"
              )}
            >
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm",
                isPublic ? "left-[26px]" : "left-0.5"
              )} />
            </button>
          </div>
          <p className="text-[10px] text-brand-muted ml-7 leading-relaxed">
            Allow other users to view your score, badges, public plants, grow journeys, and posts.
          </p>
        </div>

        {[
          { icon: <Trophy size={18} className="text-brand-earth" />, label: "Leaderboard", href: "/leaderboard" },
          { icon: <Settings size={18} className="text-brand-muted" />, label: "Settings", href: "#" },
          { icon: <HelpCircle size={18} className="text-brand-info" />, label: "Help & Support", href: "#" },
          { icon: <LogOut size={18} className="text-brand-danger" />, label: "Log Out", href: "#", danger: true },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <div className="lufora-card-hover p-3.5 flex items-center gap-3 mb-1.5">
              {item.icon}
              <span className={cn("text-sm font-medium flex-1", item.danger ? "text-brand-danger" : "text-brand-dark")}>{item.label}</span>
              <ChevronRight size={16} className="text-brand-muted" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function TrophyIcon() {
  return <Star size={16} className="text-brand-warning" />;
}
