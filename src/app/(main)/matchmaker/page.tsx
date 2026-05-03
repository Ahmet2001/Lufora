/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api-client";
import { getPlantEmoji } from "@/lib/utils";

type Step = "intro" | "quiz" | "loading" | "results";

const QUIZ_QUESTIONS = [
  {
    id: "hasPets",
    title: "Do you have pets?",
    subtitle: "We'll only recommend pet-safe plants if you do.",
    options: [
      { label: "Yes, dog or cat", value: true },
      { label: "No pets", value: false },
    ]
  },
  {
    id: "environmentType",
    title: "Where will the plant live?",
    options: [
      { label: "Indoor (Living Room, Bedroom)", value: "indoor" },
      { label: "Outdoor (Balcony, Patio)", value: "outdoor" },
    ]
  },
  {
    id: "lightLevel",
    title: "What's the light situation?",
    options: [
      { label: "Low Light (North facing, far from window)", value: "low" },
      { label: "Medium Light (East/West facing)", value: "medium" },
      { label: "Bright Light (South facing, sunny)", value: "bright" },
    ]
  },
  {
    id: "careFrequency",
    title: "How often can you care for it?",
    options: [
      { label: "Daily (I love tending to plants)", value: "daily" },
      { label: "Weekly (Weekend waterer)", value: "weekly" },
      { label: "Rarely (I forget sometimes)", value: "rarely" },
    ]
  },
  {
    id: "experienceLevel",
    title: "What's your experience level?",
    options: [
      { label: "Beginner (New to plants)", value: "beginner" },
      { label: "Intermediate (I've kept a few alive)", value: "intermediate" },
      { label: "Advanced (Plant master)", value: "advanced" },
    ]
  }
];

export default function MatchmakerPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setStep("quiz");
    setCurrentQuestionIdx(0);
    setAnswers({});
  };

  const handleAnswer = async (value: unknown) => {
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIdx];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finished quiz
      setStep("loading");
      try {
        const res = await api.plantMatchmaker(newAnswers);
        setResults(res.recommendations);
        setStep("results");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to find matches");
        setStep("quiz"); // Go back to last question so they can retry
      }
    }
  };

  const handleBack = () => {
    if (step === "intro") router.back();
    else if (step === "quiz") {
      if (currentQuestionIdx === 0) setStep("intro");
      else setCurrentQuestionIdx(prev => prev - 1);
    } else if (step === "results") {
      setStep("quiz");
      setCurrentQuestionIdx(QUIZ_QUESTIONS.length - 1);
    }
  };

  return (
    <div className="page-container bottom-safe min-h-screen flex flex-col">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <button onClick={handleBack} className="p-2 -ml-2 text-brand-dark rounded-full hover:bg-surface-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-display text-xl font-bold text-brand-dark">Matchmaker</h1>
      </div>

      {error && (
        <div className="lufora-card bg-red-50 border-red-100 p-4 mb-6 flex items-start gap-3 shrink-0">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* INTRO STEP */}
      {step === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in max-w-sm mx-auto">
          <div className="w-24 h-24 rounded-full bg-brand-soft flex items-center justify-center mb-6 relative">
            <Sparkles size={40} className="text-brand-primary" />
            <div className="absolute -top-2 -right-2 text-3xl">🌿</div>
          </div>
          <h2 className="text-3xl font-display font-bold text-brand-dark mb-4">Find Your Perfect Match</h2>
          <p className="text-brand-muted mb-10 leading-relaxed">
            Tell us about your lifestyle and space, and our AI will recommend the perfect plants for you.
          </p>
          <Button variant="primary" size="lg" className="w-full text-lg shadow-lg shadow-brand-primary/20" onClick={handleStart}>
            Take the Quiz <ChevronRight size={20} className="ml-1" />
          </Button>
        </div>
      )}

      {/* QUIZ STEP */}
      {step === "quiz" && (
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full animate-slide-up">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-brand-muted mb-2 uppercase tracking-wider">
              <span>Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center mb-10">
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-2 text-center">
              {QUIZ_QUESTIONS[currentQuestionIdx].title}
            </h2>
            {QUIZ_QUESTIONS[currentQuestionIdx].subtitle && (
              <p className="text-sm text-brand-muted text-center mb-8">
                {QUIZ_QUESTIONS[currentQuestionIdx].subtitle}
              </p>
            )}

            <div className="space-y-3 mt-6">
              {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="w-full text-left p-5 rounded-2xl border-2 border-surface-200 bg-white hover:border-brand-primary hover:bg-brand-soft/30 transition-all font-semibold text-brand-dark shadow-sm flex justify-between items-center group"
                >
                  {opt.label}
                  <ChevronRight size={18} className="text-brand-muted group-hover:text-brand-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOADING STEP */}
      {step === "loading" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-surface-200" />
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles size={24} className="text-brand-primary animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-brand-dark mb-2">Analyzing your profile...</h2>
          <p className="text-sm text-brand-muted">Finding the perfect botanical companions</p>
        </div>
      )}

      {/* RESULTS STEP */}
      {step === "results" && (
        <div className="animate-slide-up pb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-soft text-brand-primary mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">Your Perfect Matches</h2>
            <p className="text-sm text-brand-muted">Based on your answers, these plants will thrive with you.</p>
          </div>

          <div className="space-y-6">
            {results.map((plant, i) => (
              <div key={i} className="lufora-card overflow-hidden border-2 border-transparent hover:border-brand-primary/30 transition-colors">
                <div className="bg-brand-soft/30 p-5 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm shrink-0">
                    {getPlantEmoji(plant.plantName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-brand-dark">{plant.plantName}</h3>
                      <Badge variant={plant.difficulty === "Easy" ? "success" : plant.difficulty === "Intermediate" ? "warning" : "danger"}>
                        {plant.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted italic mb-2">{plant.species}</p>
                    <Badge variant="primary" className="text-[10px]">{(plant.confidence * 100).toFixed(0)}% Match</Badge>
                  </div>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-brand-muted uppercase mb-1">Why it fits you</h4>
                    <p className="text-sm font-medium text-brand-dark leading-relaxed">{plant.whyItFits}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 bg-surface-100 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-brand-muted uppercase block mb-0.5">Light</span>
                      <span className="text-xs font-semibold text-brand-dark">{plant.lightNeeds}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-brand-muted uppercase block mb-0.5">Water</span>
                      <span className="text-xs font-semibold text-brand-dark">{plant.wateringNeeds}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <Button variant="primary" className="flex-1 py-2 text-sm" onClick={() => router.push("/plants/add")}>
                      Add Plant
                    </Button>
                    <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => router.push("/grow")}>
                      Start Journey
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button onClick={handleStart} className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors">
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
