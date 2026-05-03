"use client";

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, PenSquare, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_COMMUNITY_POSTS } from "@/lib/mock-data";
import { api, ApiPost } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { COMMUNITY_CATEGORIES } from "@/types";
import { timeAgo, cn } from "@/lib/utils";

const fallbackPosts: ApiPost[] = MOCK_COMMUNITY_POSTS.map(p => ({
  ...p,
  likesCount: p.likeCount,
  repliesCount: p.commentCount,
  author: { id: p.userId, name: p.userName, avatarUrl: p.userAvatar },
}));

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data: posts, loading } = useApi(
    () => api.getPosts(activeCategory ? { category: activeCategory } : undefined),
    fallbackPosts,
    [activeCategory]
  );

  const filtered = (posts || []).filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container bottom-safe">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <div>
          <h1 className="page-title">Community</h1>
          <p className="page-subtitle">Share, learn, and grow together</p>
        </div>
        <button className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20">
          <PenSquare size={18} className="text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 animate-slide-up">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted/60" />
        <input
          type="text"
          placeholder="Search discussions..."
          className="input-field pl-10 text-sm"
          id="search-community"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5 -mx-5 px-5 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <button onClick={() => setActiveCategory(null)} className={cn("chip", !activeCategory && "chip-active")}>All</button>
        {COMMUNITY_CATEGORIES.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={cn("chip", activeCategory === cat.key && "chip-active")}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Posts */}
      {!loading && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="lufora-card p-6 text-center animate-fade-in">
              <span className="text-4xl block mb-2">🌿</span>
              <p className="text-sm font-medium text-brand-dark">No posts found</p>
              <p className="text-xs text-brand-muted">Be the first to start a discussion!</p>
            </div>
          )}
          {filtered.map((post, i) => {
            const category = COMMUNITY_CATEGORIES.find((c) => c.key === post.category);
            return (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="lufora-card-hover p-4 mb-3 animate-slide-up" style={{ animationDelay: `${i * 0.05 + 0.1}s` }}>
                  {/* Author */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Link href={`/users/${post.author?.id || "demo-id"}`} className="flex items-center gap-2.5 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <Avatar name={post.author?.name || "Lufora User"} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-dark hover:underline">{post.author?.name || "Lufora User"}</p>
                        <p className="text-[10px] text-brand-muted">{timeAgo(post.createdAt)}</p>
                      </div>
                    </Link>
                    {category && <Badge variant="neutral">{category.emoji} {category.label}</Badge>}
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-semibold text-brand-dark mb-1.5 leading-snug">{post.title}</h3>
                  <p className="text-sm text-brand-muted line-clamp-2 mb-3 leading-relaxed">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2.5 border-t border-surface-100">
                    <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <Heart size={15} /> {post.likesCount}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <MessageCircle size={15} /> {post.repliesCount}
                    </span>
                    {post.category === "save_my_plant" && (
                      <Badge variant="info" className="ml-auto">
                        <Sparkles size={10} /> AI Analysis
                      </Badge>
                    )}
                    <Bookmark size={15} className="text-brand-muted ml-auto" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
