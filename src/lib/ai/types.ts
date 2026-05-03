// AI Service interfaces — shared by mock and real implementations

export interface PlantDoctorRequest {
  plantName: string;
  species?: string;
  symptoms: string;
  imageUrl?: string;
}

export interface PlantDoctorResponse {
  diagnosis: string;
  confidence: number; // 0-1
  recommendations: string[];
  urgency: "low" | "medium" | "high";
}

export interface GrowGuidePlanRequest {
  plantName: string;
  species?: string;
  startType: "seed" | "seedling" | "cutting" | "bulb_tuber";
}

export interface GrowGuidePlanResponse {
  stages: {
    name: string;
    durationDays: number;
    description: string;
    tasks: string[];
  }[];
  tips: string[];
  estimatedTotalDays: number;
}

export interface GrowGuideQuestionRequest {
  plantName: string;
  currentStage: string;
  dayNumber: number;
  question: string;
}

export interface GrowGuideQuestionResponse {
  answer: string;
  relatedTips: string[];
}

export interface IAIService {
  diagnose(req: PlantDoctorRequest): Promise<PlantDoctorResponse>;
  generateGrowPlan(req: GrowGuidePlanRequest): Promise<GrowGuidePlanResponse>;
  answerGrowQuestion(req: GrowGuideQuestionRequest): Promise<GrowGuideQuestionResponse>;
}
