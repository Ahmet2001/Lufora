"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Camera, CheckCircle2, Droplets, ImagePlus, Sparkles, Sun, Wind } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CardSkeleton, NotFoundState } from "@/components/ui/Skeleton";
import { MOCK_PLANTS, MOCK_PLANT_TASKS, MOCK_HEALTH_LOGS, MOCK_AI_DOCTOR_RESULT } from "@/lib/mock-data";
import { api, ApiDoctorResult } from "@/lib/api-client";
import { useApi } from "@/hooks/useApi";
import { getHealthColor, getHealthLabel, getPlantEmoji, formatDate, cn } from "@/lib/utils";

const TABS = ["Overview", "Tasks", "Growth", "Doctor"] as const;

export default function PlantDetailPage() {
  const params = useParams();
  const plantId = params.id as string;
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [symptoms, setSymptoms] = useState("");
  const [doctorResult, setDoctorResult] = useState<ApiDoctorResult | null>(null);
  const [doctorLoading, setDoctorLoading] = useState(false);

  const mockPlant = MOCK_PLANTS[0];
  const { data: plant, loading } = useApi(
    () => api.getPlant(plantId),
    {
      ...mockPlant,
      healthScore: mockPlant.latestHealthScore,
      status: "active",
      tasks: MOCK_PLANT_TASKS.map(t => ({ ...t, type: "check", description: null, dueDate: "", completedAt: t.completed ? new Date().toISOString() : null, isRecurring: false, intervalDays: null, plantId: mockPlant.id, journeyId: null })),
      healthLogs: MOCK_HEALTH_LOGS.map(l => ({ ...l, source: "manual" })),
      photos: [],
    },
    [plantId]
  );
  const { data: healthLogs } = useApi(
    () => api.getPlantHealthLogs(plantId),
    MOCK_HEALTH_LOGS.map(l => ({ ...l, source: "manual" })),
    [plantId]
  );

  const runDoctor = async () => {
    if (!plant || !symptoms.trim()) return;
    setDoctorLoading(true);
    try {
      const result = await api.plantDoctor({ plantName: plant.nickname, symptoms });
      setDoctorResult(result);
    } catch {
      setDoctorResult({
        ...MOCK_AI_DOCTOR_RESULT,
        possibleCauses: [MOCK_AI_DOCTOR_RESULT.diagnosis],
        suggestedActions: MOCK_AI_DOCTOR_RESULT.steps,
        disclaimer: "This is a mock AI analysis for development.",
      });
    } finally {
      setDoctorLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container bottom-safe">
        <Link href="/plants" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4"><ArrowLeft size={18} /> My Plants</Link>
        <CardSkeleton />
        <div className="mt-4"><CardSkeleton /></div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="page-container bottom-safe">
        <Link href="/plants" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4"><ArrowLeft size={18} /> My Plants</Link>
        <NotFoundState title="Plant not found" description="This plant doesn't exist or has been removed." />
      </div>
    );
  }

  const logs = plant.healthLogs || healthLogs || [];
  const tasks = plant.tasks || [];

  return (
    <div className="page-container bottom-safe">
      <Link href="/plants" className="inline-flex items-center gap-1.5 text-sm text-brand-muted mb-4 hover:text-brand-dark transition-colors">
        <ArrowLeft size={18} /> My Plants
      </Link>

      {/* Hero */}
      <div className="lufora-card overflow-hidden mb-5 animate-fade-in">
        <div className="h-44 bg-gradient-to-br from-brand-soft via-surface-100 to-brand-cream flex items-center justify-center relative">
          <span className="text-7xl">{getPlantEmoji(plant.nickname || plant.species || "plant")}</span>
          <div className="absolute bottom-3 right-3">
            <button className="w-9 h-9 rounded-full bg-white/90 shadow-card flex items-center justify-center">
              <Camera size={16} className="text-brand-muted" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-xl font-bold text-brand-dark">{plant.nickname}</h1>
              <p className="text-sm text-brand-muted">{plant.species}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${getHealthColor(plant.healthScore)}`}>{plant.healthScore}</p>
              <p className={`text-xs font-medium ${getHealthColor(plant.healthScore)}`}>{getHealthLabel(plant.healthScore)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 bg-surface-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={cn("tab-btn flex-1 text-center", activeTab === tab ? "tab-btn-active" : "tab-btn-inactive")}>
            {tab}
          </button>
        ))}
      </div>

      <div className="animate-fade-in">
        {activeTab === "Overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="lufora-card p-3.5">
                <Droplets size={18} className="text-blue-400 mb-1.5" />
                <p className="text-xs text-brand-muted">Location</p>
                <p className="text-sm font-semibold text-brand-dark capitalize">{plant.location}</p>
              </div>
              <div className="lufora-card p-3.5">
                <Droplets size={18} className="text-brand-primary mb-1.5" />
                <p className="text-xs text-brand-muted">Acquired</p>
                <p className="text-sm font-semibold text-brand-dark">{plant.acquiredDate ? formatDate(plant.acquiredDate) : "—"}</p>
              </div>
              <div className="lufora-card p-3.5">
                <Sun size={18} className="text-amber-400 mb-1.5" />
                <p className="text-xs text-brand-muted">Status</p>
                <p className="text-sm font-semibold text-brand-dark capitalize">{plant.status}</p>
              </div>
              <div className="lufora-card p-3.5">
                <Wind size={18} className="text-sky-400 mb-1.5" />
                <p className="text-xs text-brand-muted">Tasks</p>
                <p className="text-sm font-semibold text-brand-dark">{tasks.length} total</p>
              </div>
            </div>
            {plant.notes && (
              <div className="lufora-card p-4 border-brand-primary/20 bg-brand-soft/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-primary" />
                  <p className="text-sm font-semibold text-brand-dark">Notes</p>
                </div>
                <p className="text-sm text-brand-muted leading-relaxed">{plant.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Tasks" && (
          <div className="space-y-2">
            {tasks.length === 0 && (
              <p className="text-sm text-brand-muted text-center py-8">No tasks yet for this plant.</p>
            )}
            {tasks.map((task) => (
              <div key={task.id} className="lufora-card p-3.5 flex items-center gap-3">
                <button className={cn(
                  "w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  task.completedAt ? "bg-brand-primary border-brand-primary" : "border-surface-300 hover:border-brand-primary"
                )}>
                  {task.completedAt && <CheckCircle2 size={16} className="text-white" />}
                </button>
                <div className="flex-1">
                  <p className={cn("text-sm font-medium", task.completedAt ? "text-brand-muted line-through" : "text-brand-dark")}>{task.title}</p>
                </div>
                <Badge variant="primary">+{task.points} pts</Badge>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Growth" && (
          <div className="space-y-4">
            <h3 className="section-title">Health History</h3>
            {logs.length === 0 && (
              <p className="text-sm text-brand-muted text-center py-6">No health logs recorded yet.</p>
            )}
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="lufora-card p-3 flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold", getHealthColor(log.score), "bg-white border border-surface-200")}>
                    {log.score}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-brand-muted">{formatDate(log.createdAt)}</p>
                    {log.note && <p className="text-sm text-brand-dark">{log.note}</p>}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" fullWidth icon={<ImagePlus size={16} />}>Add New Photo</Button>
          </div>
        )}

        {activeTab === "Doctor" && (
          <div className="space-y-4">
            <div className="lufora-card p-4 border-dashed border-2 border-surface-300 flex flex-col items-center text-center">
              <Camera size={28} className="text-brand-muted mb-2" />
              <p className="text-sm font-medium text-brand-dark mb-1">Upload a photo</p>
              <p className="text-xs text-brand-muted">Take or upload a photo of the affected area</p>
            </div>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="Describe the issue you're noticing..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
            <Button fullWidth icon={<Sparkles size={16} />} isLoading={doctorLoading} onClick={runDoctor}>
              Start AI Analysis
            </Button>

            {doctorResult && (
              <div className="lufora-card p-4 border-brand-warning/30 bg-brand-warning-light/20 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-brand-warning" />
                  <h3 className="text-sm font-semibold text-brand-dark">AI Analysis Result</h3>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-muted">Possible cause</span>
                    <span className="text-sm font-semibold text-brand-dark">{doctorResult.diagnosis}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-muted">Confidence</span>
                    <Badge variant="warning">{doctorResult.confidence}</Badge>
                  </div>
                </div>
                <p className="text-xs text-brand-muted mb-3">{doctorResult.description}</p>
                <h4 className="text-xs font-semibold text-brand-dark mb-2">Suggested Steps</h4>
                <div className="space-y-1.5">
                  {doctorResult.suggestedActions.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-brand-muted">
                      <span className="text-brand-primary mt-0.5 font-bold">{i + 1}.</span>
                      {step}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-brand-muted/60 mt-3 italic">{doctorResult.disclaimer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
