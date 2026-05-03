/**
 * Lufora API Client — typed fetch helpers with error handling and mock fallback.
 */

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error || res.statusText);
  }
  return res.json();
}

// ─── GET helpers ───

export const api = {
  // User
  getMe: () => request<ApiUser>("/api/me"),
  getProfile: () => request<ApiProfile>("/api/profile"),
  getMyBadges: () => request<ApiBadge[]>("/api/me/badges"),

  // Plants
  getPlants: () => request<ApiPlant[]>("/api/plants"),
  getPlant: (id: string) => request<ApiPlantDetail>(`/api/plants/${id}`),
  getPlantHealthLogs: (id: string) => request<ApiHealthLog[]>(`/api/plants/${id}/health-logs`),

  // Tasks
  getTasks: () => request<ApiTask[]>("/api/tasks"),
  getTodayTasks: () => request<ApiTask[]>("/api/tasks/today"),
  completeTask: (id: string) => request<ApiCompleteResult>(`/api/tasks/${id}/complete`, { method: "POST" }),

  // Grow Journeys
  getJourneys: () => request<ApiJourney[]>("/api/grow-journeys"),
  getJourney: (id: string) => request<ApiJourneyDetail>(`/api/grow-journeys/${id}`),

  // Community
  getPosts: (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    return request<ApiPost[]>(`/api/community/posts${qs ? `?${qs}` : ""}`);
  },

  // Leaderboard
  getLeaderboard: (period?: string) =>
    request<ApiLeaderboardEntry[]>(`/api/leaderboard${period ? `?period=${period}` : ""}`),

  // Badges
  getAllBadges: () => request<ApiBadge[]>("/api/badges"),

  // AI
  plantDoctor: (data: { plantName: string; symptoms: string; imageUrl?: string }) =>
    request<ApiDoctorResult>("/api/ai/plant-doctor", { method: "POST", body: JSON.stringify(data) }),

  growGuide: (data: { journeyId: string; question: string }) =>
    request<ApiGuideResult>("/api/ai/grow-guide", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Types (match API response shapes) ───

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  totalPoints: number;
  level: number;
  streak: number;
  _count?: { plants: number; growJourneys: number; communityPosts: number };
}

export interface ApiProfile extends ApiUser {
  badges: { badge: ApiBadge; awardedAt: string }[];
}

export interface ApiBadge {
  id: string;
  name: string;
  iconEmoji: string;
  description: string;
  category: string;
  requiredCount: number;
}

export interface ApiPlant {
  id: string;
  nickname: string;
  species: string | null;
  imageUrl: string | null;
  location: string;
  healthScore: number;
  status: string;
  acquiredDate: string | null;
  notes: string | null;
  createdAt: string;
  tasks?: ApiTask[];
  healthLogs?: ApiHealthLog[];
  photos?: { id: string; imageUrl: string; caption: string | null; createdAt: string }[];
}

export interface ApiPlantDetail extends ApiPlant {
  tasks: ApiTask[];
  healthLogs: ApiHealthLog[];
  photos: { id: string; imageUrl: string; caption: string | null; createdAt: string }[];
}

export interface ApiHealthLog {
  id: string;
  score: number;
  note: string | null;
  source: string;
  createdAt: string;
}

export interface ApiTask {
  id: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: string;
  completedAt: string | null;
  isRecurring: boolean;
  intervalDays: number | null;
  points: number;
  plantId: string | null;
  journeyId: string | null;
  plant?: { nickname: string; species: string | null } | null;
  journey?: { plantName: string } | null;
}

export interface ApiCompleteResult {
  task: ApiTask;
  pointsAwarded: number;
  newBadges?: ApiBadge[];
}

export interface ApiJourney {
  id: string;
  plantName: string;
  species: string | null;
  imageUrl: string | null;
  startType: string;
  currentStage: string;
  progressPercent: number;
  dayNumber: number;
  pointsEarned: number;
  status: string;
  startedAt: string;
  environmentType: string | null;
}

export interface ApiJourneyDetail extends ApiJourney {
  photos: { id: string; imageUrl: string; stage: string; caption: string | null; createdAt: string }[];
  milestones: { id: string; title: string; stage: string; completedAt: string | null; pointsAwarded: number }[];
  tasks: ApiTask[];
}

export interface ApiPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null };
}

export interface ApiLeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  totalPoints: number;
  level: number;
  _count: { plants: number; communityPosts: number };
  rank?: number;
}

export interface ApiDoctorResult {
  diagnosis: string;
  confidence: string;
  description: string;
  possibleCauses: string[];
  suggestedActions: string[];
  disclaimer: string;
}

export interface ApiGuideResult {
  answer: string;
  tips: string[];
  disclaimer: string;
}
