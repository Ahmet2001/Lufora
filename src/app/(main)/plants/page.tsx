"use client";

import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { PlantCardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_PLANTS } from "@/lib/mock-data";
import { api } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { getHealthColor, getHealthLabel, getPlantEmoji, formatDate } from "@/lib/utils";

export default function PlantsPage() {
  const [search, setSearch] = useState("");
  const { data: plants, loading } = useApi(
    () => api.getPlants(),
    MOCK_PLANTS.map(p => ({ ...p, healthScore: p.latestHealthScore, status: "active" }))
  );

  const filtered = (plants || []).filter(p =>
    !search || p.nickname.toLowerCase().includes(search.toLowerCase()) || (p.species || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-container bottom-safe">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 animate-fade-in">
        <div>
          <h1 className="page-title">My Plants</h1>
          <p className="page-subtitle">{(plants || []).length} plants in your care</p>
        </div>
        <Link
          href="/plants/add"
          className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20"
        >
          <Plus size={20} className="text-white" />
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-5 animate-slide-up">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted/60" />
          <input
            type="text"
            placeholder="Search plants..."
            className="input-field pl-10 text-sm"
            id="search-plants"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="w-12 h-12 rounded-xl border border-surface-200 bg-white flex items-center justify-center shadow-card">
          <Filter size={18} className="text-brand-muted" />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <PlantCardSkeleton key={i} />)}
        </div>
      )}

      {/* Plant Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((plant, i) => (
            <Link key={plant.id} href={`/plants/${plant.id}`}>
              <div
                className="lufora-card-hover overflow-hidden animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Plant Image */}
                <div className="h-28 bg-gradient-to-br from-brand-soft to-surface-100 flex items-center justify-center relative">
                  <span className="text-4xl">{getPlantEmoji(plant.nickname || plant.species || "plant")}</span>
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${getHealthColor(plant.healthScore)} bg-white/90 shadow-sm`}>
                    {plant.healthScore}
                  </div>
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-brand-dark truncate">{plant.nickname}</p>
                  <p className="text-[11px] text-brand-muted truncate mb-2">{plant.species}</p>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={plant.location === "indoor" ? "info" : plant.location === "balcony" ? "earth" : "primary"}>
                      {plant.location}
                    </Badge>
                  </div>
                  <ProgressBar value={plant.healthScore} size="sm" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-brand-muted">💧 {formatDate(plant.acquiredDate || plant.createdAt)}</span>
                    <span className={`text-[10px] font-medium ${getHealthColor(plant.healthScore)}`}>
                      {getHealthLabel(plant.healthScore)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <span className="text-6xl mb-4">🌿</span>
          <h3 className="font-display font-semibold text-lg text-brand-dark mb-1">
            {search ? "No plants found" : "Add your first plant"}
          </h3>
          <p className="text-sm text-brand-muted max-w-xs mb-5">
            {search ? "Try a different search term." : "Take a photo, identify your plant, and create a personalized care plan."}
          </p>
          {!search && (
            <Link href="/plants/add">
              <Button icon={<Plus size={18} />}>Add Plant</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
