"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { TaskSkeleton } from "@/components/ui/Skeleton";
import { MOCK_CARE_TASKS } from "@/lib/mock-data";
import { api, ApiTask } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { cn, getPlantEmoji } from "@/lib/utils";
import { CARE_TASK_ICONS } from "@/types";
import type { CareTaskType } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [28, 29, 30, 1, 2, 3, 4];
const TODAY_INDEX = 2; // Wednesday Apr 30

export default function CalendarPage() {
  const { data: tasks, loading, refetch } = useApi(
    () => api.getTasks(),
    MOCK_CARE_TASKS.map(t => ({
      ...t,
      description: t.description || null,
      plant: t.plantId ? { nickname: t.plantName, species: null } : null,
      journey: t.journeyId ? { plantName: t.plantName } : null,
    }))
  );
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());
  const [earnedPoints, setEarnedPoints] = useState<Record<string, number>>({});

  const allTasks = tasks || [];
  const pendingTasks = allTasks.filter(t => !t.completedAt && !justCompleted.has(t.id));
  const completedTasks = allTasks.filter(t => t.completedAt || justCompleted.has(t.id));

  const getTaskName = (task: ApiTask) => task.plant?.nickname || task.journey?.plantName || "Plant";

  const handleComplete = async (taskId: string) => {
    setCompletingId(taskId);
    try {
      const result = await api.completeTask(taskId);
      setJustCompleted(prev => new Set(prev).add(taskId));
      setEarnedPoints(prev => ({ ...prev, [taskId]: result.pointsAwarded }));
    } catch {
      // Optimistically complete on failure (mock mode)
      setJustCompleted(prev => new Set(prev).add(taskId));
      const task = allTasks.find(t => t.id === taskId);
      setEarnedPoints(prev => ({ ...prev, [taskId]: task?.points || 10 }));
    } finally {
      setCompletingId(null);
      // Refetch after a delay to let the animation play
      setTimeout(() => refetch(), 1500);
    }
  };

  return (
    <div className="page-container bottom-safe">
      <div className="flex items-center gap-3 mb-5 animate-fade-in">
        <Link href="/home" className="p-2 -ml-2 rounded-xl hover:bg-surface-100 transition-colors">
          <ArrowLeft size={20} className="text-brand-dark" />
        </Link>
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Your care schedule</p>
        </div>
      </div>

      {/* Week Strip */}
      <div className="flex items-center justify-between mb-6 animate-slide-up">
        {DAYS.map((day, i) => (
          <button
            key={day}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-2.5 rounded-2xl transition-all",
              i === TODAY_INDEX
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                : "text-brand-muted hover:bg-surface-100"
            )}
          >
            <span className="text-[10px] font-medium">{day}</span>
            <span className={cn("text-base font-bold", i === TODAY_INDEX && "text-white")}>
              {DATES[i]}
            </span>
            {i === TODAY_INDEX && <span className="w-1 h-1 rounded-full bg-white" />}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <TaskSkeleton key={i} />)}
        </div>
      )}

      {/* Pending */}
      {!loading && (
        <section className="mb-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <h2 className="section-title mb-3">Today — {pendingTasks.length} tasks</h2>
          {pendingTasks.length === 0 && (
            <div className="lufora-card p-6 text-center">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="text-sm font-medium text-brand-dark">All tasks completed!</p>
              <p className="text-xs text-brand-muted">Great work taking care of your plants.</p>
            </div>
          )}
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <div key={task.id} className="lufora-card p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center text-lg shrink-0">
                  {CARE_TASK_ICONS[task.type as CareTaskType] || getPlantEmoji(getTaskName(task))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-dark truncate">{task.title}</p>
                  <p className="text-xs text-brand-muted">{getTaskName(task)} · {task.journeyId ? "Journey" : "Plant"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="primary">+{task.points}</Badge>
                  <button
                    onClick={() => handleComplete(task.id)}
                    disabled={completingId === task.id}
                    className="w-8 h-8 rounded-full border-2 border-brand-primary/30 hover:bg-brand-soft transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {completingId === task.id ? (
                      <Loader2 size={16} className="text-brand-primary animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} className="text-brand-primary" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {!loading && completedTasks.length > 0 && (
        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="section-title mb-3 text-brand-muted">Completed</h2>
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div key={task.id} className={cn("lufora-card p-3.5 flex items-center gap-3", justCompleted.has(task.id) ? "animate-fade-in" : "opacity-60")}>
                <div className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} className="text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-muted line-through truncate">{task.title}</p>
                  <p className="text-xs text-brand-muted">{getTaskName(task)}</p>
                </div>
                <Badge variant={justCompleted.has(task.id) ? "primary" : "neutral"}>
                  +{earnedPoints[task.id] || task.points} {justCompleted.has(task.id) ? "🎉" : "✓"}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
