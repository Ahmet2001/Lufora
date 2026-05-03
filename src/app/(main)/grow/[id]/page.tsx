"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { CardSkeleton, NotFoundState } from "@/components/ui/Skeleton";
import { MOCK_JOURNEYS, MOCK_JOURNEY_TASKS, MOCK_JOURNEY_TIMELINE } from "@/lib/mock-data";
import { api, ApiGuideResult } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { JOURNEY_STAGES } from "@/types";
import { cn } from "@/lib/utils";

const TABS = ["Overview", "Tasks", "Timeline", "AI Guide"] as const;

const SUGGESTED_QUESTIONS = [
  "Why is my seedling leaning?",
  "When should I move it to a bigger pot?",
  "How much light does it need?",
  "Is it ready for pot transfer?",
];

export default function JourneyDetailPage() {
  const params = useParams();
  const journeyId = params.id as string;
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [question, setQuestion] = useState("");
  const [guideResult, setGuideResult] = useState<ApiGuideResult | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);

  const mockJourney = MOCK_JOURNEYS[0];
  const { data: journey, loading } = useApi(
    () => api.getJourney(journeyId),
    {
      ...mockJourney,
      environmentType: null,
      photos: [],
      milestones: [],
      tasks: MOCK_JOURNEY_TASKS.map(t => ({
        ...t, type: "check", description: null, dueDate: "", completedAt: t.completed ? new Date().toISOString() : null,
        isRecurring: false, intervalDays: null, plantId: null, journeyId: mockJourney.id
      })),
    },
    [journeyId]
  );

  const currentStageIndex = journey ? JOURNEY_STAGES.findIndex((s) => s.key === journey.currentStage) : 0;

  const askGuide = async (q: string) => {
    if (!journey) return;
    setGuideLoading(true);
    try {
      const result = await api.growGuide({ journeyId: journey.id, question: q });
      setGuideResult(result);
    } catch {
      setGuideResult({
        answer: "Based on the current stage of your plant, make sure to provide adequate light and keep the soil consistently moist but not waterlogged.",
        tips: ["Rotate the pot every 2 days", "Ensure 6-8 hours of light", "Check soil moisture daily"],
        disclaimer: "This is a mock AI response for development.",
      });
    } finally {
      setGuideLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container bottom-safe">
        <Link href="/grow" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4"><ArrowLeft size={18} /> Grow Journey</Link>
        <CardSkeleton />
        <div className="mt-4"><CardSkeleton /></div>
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="page-container bottom-safe">
        <Link href="/grow" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4"><ArrowLeft size={18} /> Grow Journey</Link>
        <NotFoundState title="Journey not found" description="This grow journey doesn't exist or has been removed." />
      </div>
    );
  }

  const tasks = journey.tasks || [];
  const timeline = journey.photos?.length
    ? journey.photos.map(p => ({ id: p.id, type: "photo" as const, label: p.caption || "Photo", stage: p.stage, day: 0, date: p.createdAt, note: null, emoji: "📸" }))
    : MOCK_JOURNEY_TIMELINE;

  return (
    <div className="page-container bottom-safe">
      <Link href="/grow" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4 hover:text-brand-dark transition-colors">
        <ArrowLeft size={18} /> Grow Journey
      </Link>

      {/* Hero */}
      <div className="lufora-card overflow-hidden mb-5 animate-fade-in">
        <div className="h-36 bg-gradient-to-br from-brand-soft via-[#F5EDE0] to-brand-cream flex items-center justify-center">
          <span className="text-6xl">🌱</span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="font-display text-xl font-bold text-brand-dark">{journey.plantName}</h1>
              <p className="text-sm text-brand-muted">{journey.species}</p>
            </div>
            <Badge variant="primary">Day {journey.dayNumber}</Badge>
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="earth">🌰 {journey.startType}</Badge>
            <Badge variant="primary">🌿 {journey.currentStage}</Badge>
          </div>
          <ProgressBar value={journey.progressPercent} size="md" showLabel label="Journey Progress" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 bg-surface-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn("tab-btn flex-1 text-center whitespace-nowrap", activeTab === tab ? "tab-btn-active" : "tab-btn-inactive")}>
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="lufora-card p-3.5">
                <p className="text-xs text-brand-muted mb-1">Current Stage</p>
                <p className="text-sm font-semibold text-brand-dark">🌿 {journey.currentStage}</p>
              </div>
              <div className="lufora-card p-3.5">
                <p className="text-xs text-brand-muted mb-1">Points Earned</p>
                <p className="text-sm font-semibold text-brand-primary">{journey.pointsEarned} pts</p>
              </div>
              <div className="lufora-card p-3.5">
                <p className="text-xs text-brand-muted mb-1">Start Type</p>
                <p className="text-sm font-semibold text-brand-dark capitalize">{journey.startType}</p>
              </div>
              <div className="lufora-card p-3.5">
                <p className="text-xs text-brand-muted mb-1">Progress</p>
                <p className="text-sm font-semibold text-brand-dark">{journey.progressPercent}%</p>
              </div>
            </div>
            {/* Mini stage progress */}
            <div className="lufora-card p-4">
              <p className="text-xs font-semibold text-brand-dark mb-3">Stage Progress</p>
              <div className="flex items-center gap-1">
                {JOURNEY_STAGES.map((stage, i) => (
                  <div key={stage.key} className="flex items-center flex-1">
                    <div className={cn("w-full h-2 rounded-full", i < currentStageIndex ? "bg-brand-primary" : i === currentStageIndex ? "bg-brand-primary/50" : "bg-surface-200")} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[9px] text-brand-muted">Setup</span>
                <span className="text-[9px] text-brand-muted">Mature</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Tasks" && (
          <div className="space-y-2">
            {tasks.length === 0 && <p className="text-sm text-brand-muted text-center py-8">No tasks for this journey yet.</p>}
            {tasks.map((task) => (
              <div key={task.id} className="lufora-card p-3.5 flex items-center gap-3">
                <button className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  task.completedAt ? "bg-brand-primary border-brand-primary" : "border-surface-300 hover:border-brand-primary"
                )}>
                  {task.completedAt && <CheckCircle2 size={16} className="text-white" />}
                </button>
                <p className={cn("text-sm font-medium flex-1", task.completedAt ? "text-brand-muted line-through" : "text-brand-dark")}>{task.title}</p>
                <Badge variant={task.completedAt ? "neutral" : "primary"}>+{task.points} pts</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={item.id} className="flex gap-3 relative">
                {i < timeline.length - 1 && (
                  <div className="absolute left-[13px] top-7 w-0.5 h-full bg-surface-200" />
                )}
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs",
                  item.type === "milestone" ? "bg-brand-primary text-white" : item.type === "photo" ? "bg-brand-soft text-brand-primary border border-brand-primary/30" : "bg-surface-100 text-brand-muted"
                )}>
                  {item.type === "milestone" ? item.emoji : item.type === "photo" ? "📸" : "📝"}
                </div>
                <div className="pb-5 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-brand-dark">{item.label}</p>
                    <span className="text-[10px] text-brand-muted">Day {item.day}</span>
                  </div>
                  {item.note && <p className="text-xs text-brand-muted mt-0.5">{item.note}</p>}
                  {item.type === "photo" && (
                    <div className="mt-2 h-20 rounded-xl bg-gradient-to-br from-brand-soft to-surface-100 flex items-center justify-center">
                      <Camera size={20} className="text-brand-muted" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button variant="secondary" fullWidth icon={<Camera size={16} />}>Add Progress Photo</Button>
          </div>
        )}

        {activeTab === "AI Guide" && (
          <div className="space-y-4">
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-brand-muted/60" />
              <input
                type="text"
                placeholder="Ask AI Grow Guide anything..."
                className="input-field pl-10"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <Button fullWidth icon={<Sparkles size={16} />} isLoading={guideLoading} onClick={() => askGuide(question)}>
              Ask AI Grow Guide
            </Button>

            {guideResult && (
              <div className="lufora-card p-4 border-brand-primary/20 bg-brand-soft/30 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-primary" />
                  <p className="text-sm font-semibold text-brand-dark">AI Grow Guide</p>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed mb-3">{guideResult.answer}</p>
                {guideResult.tips.length > 0 && (
                  <>
                    <h4 className="text-xs font-semibold text-brand-dark mb-2">Tips</h4>
                    <div className="space-y-1.5">
                      {guideResult.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-brand-muted">
                          <span className="text-brand-primary mt-0.5">•</span> {tip}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                <p className="text-[10px] text-brand-muted/60 mt-3 italic">{guideResult.disclaimer}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-brand-dark mb-2">Suggested Questions</p>
              <div className="space-y-2">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => { setQuestion(q); askGuide(q); }} className="w-full text-left lufora-card p-3 text-sm text-brand-dark hover:bg-brand-soft/50 transition-colors">
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
