/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api-client";

type Step = "photo" | "identify" | "details" | "care_plan" | "success";

export default function AddPlantPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("photo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictedSpecies, setPredictedSpecies] = useState("");
  const [confidence, setConfidence] = useState(0);
  
  const [nickname, setNickname] = useState("");
  const [species, setSpecies] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [lightLevel, setLightLevel] = useState("");
  const [hasDrainage, setHasDrainage] = useState(true);

  const [carePlan, setCarePlan] = useState<any>(null);

  // Mock Photo Selection
  const handleSelectPhoto = () => {
    // In a real app, this would open a file picker or camera and upload to Cloudinary/Supabase.
    // TODO: Implement Cloudinary upload
    setImageUrl("https://placehold.co/600x800/e2e8f0/64748b?text=Plant+Preview");
  };

  const handleIdentify = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setError(null);
    try {
      await api.plantDoctor({ plantName: "Unknown", symptoms: "Identify this plant", imageUrl });
      // We'll mock the identify endpoint response with plantDoctor for simplicity, or use the real identifyPlant endpoint
      const identifyRes = await fetch("/api/ai/identify-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "Identify this plant", imageUrl }),
      }).then(r => r.json());

      if (identifyRes.data) {
        setPredictedSpecies(identifyRes.data.predictedSpecies);
        setConfidence(identifyRes.data.confidence);
        setSpecies(identifyRes.data.predictedSpecies); // Pre-fill
      }
      setStep("identify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to identify plant");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCarePlan = async () => {
    if (!nickname || !species) {
      setError("Nickname and Species are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-care-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, roomLocation, lightLevel }),
      }).then(r => r.json());

      if (res.data) {
        setCarePlan(res.data);
        setStep("care_plan");
      } else {
        throw new Error(res.error || "Failed to generate care plan");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate care plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlant = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create Plant
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          species,
          imageUrl,
          roomLocation,
          lightLevel,
          hasDrainage,
          city: undefined,
          lastWateredAt: undefined,
        }),
      }).then(r => r.json());

      if (!res.data) throw new Error(res.error || "Failed to save plant");

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container bottom-safe">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-brand-dark rounded-full hover:bg-surface-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl font-bold text-brand-dark">Add New Plant</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8 px-2">
        {["photo", "identify", "details", "care_plan"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === s ? "bg-brand-primary text-white" :
              ["photo", "identify", "details", "care_plan"].indexOf(step) > i ? "bg-brand-earth text-white" : "bg-surface-200 text-brand-muted"
            }`}>
              {i + 1}
            </div>
            {i < 3 && <div className={`w-10 h-1 mx-1 rounded ${["photo", "identify", "details", "care_plan"].indexOf(step) > i ? "bg-brand-earth" : "bg-surface-200"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="lufora-card bg-red-50 border-red-100 p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* STEP 1: PHOTO */}
      {step === "photo" && (
        <div className="animate-fade-in space-y-6">
          <p className="text-sm text-brand-dark text-center mb-6">
            Take a photo of your plant so our AI can identify it and generate a custom care plan.
          </p>
          
          {imageUrl ? (
            <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden shadow-md">
              <img src={imageUrl} alt="Plant preview" className="object-cover w-full h-full" />
              <button onClick={() => setImageUrl(null)} className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                Retake
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleSelectPhoto} className="lufora-card p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-surface-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-soft text-brand-primary flex items-center justify-center">
                  <Camera size={24} />
                </div>
                <span className="text-sm font-semibold text-brand-dark">Camera</span>
              </button>
              <button onClick={handleSelectPhoto} className="lufora-card p-6 flex flex-col items-center justify-center gap-3 aspect-square hover:bg-surface-100 transition-colors">
                <div className="w-12 h-12 rounded-full bg-surface-100 text-brand-muted flex items-center justify-center">
                  <ImageIcon size={24} />
                </div>
                <span className="text-sm font-semibold text-brand-dark">Gallery</span>
              </button>
            </div>
          )}

          <Button
            variant="primary"
            className="w-full"
            disabled={!imageUrl || loading}
            isLoading={loading}
            onClick={handleIdentify}
          >
            <Sparkles size={18} className="mr-2" /> Identify with AI
          </Button>

          <div className="text-center">
            <button onClick={() => setStep("details")} className="text-sm text-brand-muted font-medium hover:text-brand-primary transition-colors">
              Skip identification
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: IDENTIFY */}
      {step === "identify" && (
        <div className="animate-slide-up space-y-6">
          <div className="lufora-card p-6 text-center border-brand-primary/30 bg-brand-soft/20">
            <Sparkles size={24} className="mx-auto text-brand-primary mb-3" />
            <h2 className="text-lg font-bold text-brand-dark mb-1">We think it&apos;s a:</h2>
            <p className="text-2xl font-display text-brand-earth mb-2">{predictedSpecies}</p>
            <Badge variant="success">{(confidence * 100).toFixed(0)}% Confidence</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Confirm Species</label>
              <input
                type="text"
                className="input-field"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="E.g., Monstera deliciosa"
              />
              <p className="text-[10px] text-brand-muted mt-1.5">You can edit this if the AI guessed incorrectly.</p>
            </div>
          </div>

          <Button variant="primary" className="w-full" onClick={() => setStep("details")}>
            Continue
          </Button>
        </div>
      )}

      {/* STEP 3: DETAILS */}
      {step === "details" && (
        <div className="animate-slide-up space-y-5">
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Plant Nickname *</label>
            <input type="text" className="input-field" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="E.g., Barnaby" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Species *</label>
            <input type="text" className="input-field" value={species} onChange={e => setSpecies(e.target.value)} placeholder="E.g., Monstera deliciosa" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Room / Location</label>
            <select className="input-field" value={roomLocation} onChange={e => setRoomLocation(e.target.value)}>
              <option value="">Select location...</option>
              <option value="living_room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="office">Office</option>
              <option value="balcony">Balcony / Outdoor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-dark mb-1.5 uppercase tracking-wider">Light Level</label>
            <select className="input-field" value={lightLevel} onChange={e => setLightLevel(e.target.value)}>
              <option value="">Select light level...</option>
              <option value="low">Low Light</option>
              <option value="medium">Medium / Indirect Light</option>
              <option value="bright">Bright / Direct Light</option>
            </select>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-100 rounded-xl border border-surface-200">
            <input type="checkbox" id="drainage" className="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary" checked={hasDrainage} onChange={e => setHasDrainage(e.target.checked)} />
            <label htmlFor="drainage" className="text-sm font-medium text-brand-dark">Pot has drainage holes</label>
          </div>

          <Button
            variant="primary"
            className="w-full mt-4"
            disabled={!nickname || !species || loading}
            isLoading={loading}
            onClick={handleGenerateCarePlan}
          >
            <Sparkles size={18} className="mr-2" /> Generate Care Plan
          </Button>
        </div>
      )}

      {/* STEP 4: CARE PLAN */}
      {step === "care_plan" && carePlan && (
        <div className="animate-slide-up space-y-6">
          <div className="lufora-card p-6 border-brand-primary/30 bg-brand-soft/20">
            <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-brand-primary" />
              AI Care Plan for {nickname}
            </h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-brand-muted uppercase mb-1">Watering</h4>
                <p className="text-sm font-medium text-brand-dark">{carePlan.wateringFrequency}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-brand-muted uppercase mb-1">Fertilizing</h4>
                <p className="text-sm font-medium text-brand-dark">{carePlan.fertilizingFrequency}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-brand-dark">Recommended Tasks</h3>
            {Array.isArray(carePlan.recommendedTasks) && carePlan.recommendedTasks.map((task: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{task.title}</p>
                  <p className="text-[10px] text-brand-muted">Every {task.intervalDays} days</p>
                </div>
                <Badge variant="primary">+{task.points} pts</Badge>
              </div>
            ))}
            <p className="text-[10px] text-brand-muted italic mt-2">Tasks will be automatically added when you save.</p>
          </div>

          <Button variant="primary" className="w-full" isLoading={loading} onClick={handleSavePlant}>
            Save Plant & Plan
          </Button>
        </div>
      )}

      {/* STEP 5: SUCCESS */}
      {step === "success" && (
        <div className="animate-fade-in flex flex-col items-center justify-center text-center py-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">Plant Added!</h2>
          <p className="text-sm text-brand-muted mb-8 max-w-xs">
            {nickname} has been added to your collection and your AI care tasks are scheduled.
          </p>
          
          <div className="w-full space-y-3">
            <Button variant="primary" className="w-full" onClick={() => router.push("/plants")}>
              Go to My Plants
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => router.push("/home")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
