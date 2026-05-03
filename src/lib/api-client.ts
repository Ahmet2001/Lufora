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
  updateProfile: (data: Partial<ApiProfile>) => request<ApiProfile>("/api/profile", { method: "PATCH", body: JSON.stringify(data) }),
  getMyBadges: () => request<ApiBadge[]>("/api/me/badges"),
  getPublicProfile: (id: string) => request<ApiPublicProfile>(`/api/users/${id}/public-profile`),

  // Plants — normalize: API returns `roomLocation`, frontend expects `location`
  getPlants: async () => {
    const raw = await request<RawApiPlant[]>("/api/plants");
    return raw.map(normalizePlant);
  },
  getPlant: async (id: string) => {
    const raw = await request<RawApiPlant>(`/api/plants/${id}`);
    return normalizePlant(raw) as ApiPlantDetail;
  },
  getPlantHealthLogs: (id: string) => request<ApiHealthLog[]>(`/api/plants/${id}/health-logs`),

  // Tasks
  getTasks: () => request<ApiTask[]>("/api/tasks"),
  getTodayTasks: () => request<ApiTask[]>("/api/tasks/today"),
  completeTask: (id: string) => request<ApiCompleteResult>(`/api/tasks/${id}/complete`, { method: "POST" }),

  // Grow Journeys
  getJourneys: () => request<ApiJourney[]>("/api/grow-journeys"),
  getJourney: (id: string) => request<ApiJourneyDetail>(`/api/grow-journeys/${id}`),

  // Community — normalize: API returns `user`, frontend expects `author`
  getPosts: async (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    const qs = searchParams.toString();
    const raw = await request<RawApiPost[]>(`/api/community/posts${qs ? `?${qs}` : ""}`);
    return raw.map(normalizePost);
  },

  // Leaderboard — normalize: API returns { period, leaderboard } wrapper with `points`
  getLeaderboard: async (period?: string) => {
    const raw = await request<RawLeaderboardResponse | ApiLeaderboardEntry[]>(`/api/leaderboard${period ? `?period=${period}` : ""}`);
    // Handle both wrapped { period, leaderboard } and flat array responses
    const entries = Array.isArray(raw) ? raw : (raw as RawLeaderboardResponse).leaderboard || [];
    return entries.map(normalizeLeaderboardEntry);
  },

  // Badges
  getAllBadges: () => request<ApiBadge[]>("/api/badges"),

  // AI
  plantDoctor: (data: { plantName: string; symptoms: string; imageUrl?: string }) =>
    request<ApiDoctorResult>("/api/ai/plant-doctor", { method: "POST", body: JSON.stringify(data) }),

  growGuide: (data: { journeyId: string; question: string }) =>
    request<ApiGuideResult>("/api/ai/grow-guide", { method: "POST", body: JSON.stringify(data) }),

  plantMatchmaker: (data: { environmentType?: string; lightLevel?: string; careFrequency?: string; experienceLevel?: string; hasPets?: boolean; }) =>
    request<ApiMatchmakerResult>("/api/ai/plant-matchmaker", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Types (match API response shapes) ───

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio?: string | null;
  isPublicProfile?: boolean;
  totalPoints: number;
  level: number;
  streak?: number;
  currentStreak?: number;
  _count?: { plants: number; growJourneys: number; communityPosts: number; badges?: number };
}

export interface ApiProfile extends ApiUser {
  badges?: { badge: ApiBadge; unlockedAt?: string; awardedAt?: string }[];
}

export interface ApiBadge {
  id: string;
  code?: string;
  name: string;
  icon?: string | null;
  iconEmoji?: string;
  description: string;
  category: string;
  requiredCount?: number;
  pointsReward?: number;
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
  photos?: { id: string; imageUrl: string; caption?: string | null; note?: string | null; createdAt: string }[];
}

// Raw shape from Prisma Plant model
interface RawApiPlant {
  id: string;
  nickname: string;
  species: string | null;
  imageUrl: string | null;
  roomLocation?: string | null;
  location?: string;
  healthScore: number;
  status: string;
  acquiredDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  notes?: string | null;
  lightLevel?: string | null;
  city?: string | null;
  tasks?: ApiTask[];
  healthLogs?: ApiHealthLog[];
  photos?: { id: string; imageUrl: string; caption?: string | null; note?: string | null; createdAt: string }[];
  _count?: Record<string, number>;
  [key: string]: unknown;
}

function normalizePlant(raw: RawApiPlant): ApiPlant {
  return {
    id: raw.id,
    nickname: raw.nickname || "Plant",
    species: raw.species || null,
    imageUrl: raw.imageUrl || null,
    location: raw.location || raw.roomLocation || "indoor",
    healthScore: raw.healthScore ?? 80,
    status: raw.status || "active",
    acquiredDate: raw.acquiredDate || raw.createdAt || null,
    notes: raw.notes || null,
    createdAt: raw.createdAt,
    tasks: raw.tasks,
    healthLogs: raw.healthLogs,
    photos: raw.photos,
  };
}
export interface ApiPlantDetail extends ApiPlant {
  tasks: ApiTask[];
  healthLogs: ApiHealthLog[];
  photos: { id: string; imageUrl: string; caption?: string | null; note?: string | null; createdAt: string }[];
}

export interface ApiHealthLog {
  id: string;
  score: number;
  note?: string | null;
  aiSummary?: string | null;
  source?: string;
  status?: string | null;
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

// Raw shape from API (user instead of author)
interface RawApiPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  category: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  user?: { id: string; name: string; avatarUrl: string | null };
  author?: { id: string; name: string; avatarUrl: string | null };
}

function normalizePost(raw: RawApiPost): ApiPost {
  const author = raw.author || raw.user || { id: "unknown", name: "Lufora User", avatarUrl: null };
  return { ...raw, author };
}

export interface ApiLeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  totalPoints: number;
  level: number;
  rank?: number;
  badges?: number;
  tasks?: number;
  posts?: number;
  streak?: number;
  _count?: { plants: number; communityPosts: number };
}

// Raw shape from leaderboard API
interface RawLeaderboardResponse {
  period: string;
  leaderboard: RawLeaderboardEntry[];
}

interface RawLeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string | null;
  totalPoints?: number;
  points?: number;
  level: number;
  rank?: number;
  badges?: number;
  tasks?: number;
  posts?: number;
  streak?: number;
  _count?: { plants: number; communityPosts: number };
}

function normalizeLeaderboardEntry(raw: RawLeaderboardEntry, i: number): ApiLeaderboardEntry {
  return {
    ...raw,
    totalPoints: raw.totalPoints ?? raw.points ?? 0,
    rank: raw.rank || i + 1,
  };
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

export interface ApiMatchmakerResult {
  recommendations: {
    plantName: string;
    species: string;
    difficulty: string;
    whyItFits: string;
    careSummary: string;
    lightNeeds: string;
    wateringNeeds: string;
    petSafetyNote: string;
    recommendedStartType: string;
    nextAction: string;
    confidence: number;
  }[];
  disclaimer: string;
}

export interface ApiPublicProfile {
  isPrivate: boolean;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
    bio?: string | null;
    level?: number;
    totalPoints?: number;
    currentStreak?: number;
    createdAt?: string;
    stats?: {
      badges: number;
      plants: number;
      growJourneys: number;
      communityPosts: number;
    };
  };
  badges?: ApiBadge[];
  plants?: { id: string; nickname: string; species: string | null; imageUrl: string | null; healthScore: number; status: string }[];
  growJourneys?: { id: string; plantName: string; startingType: string; currentStage: string; progressPercent: number; dayNumber: number }[];
  posts?: { id: string; title: string; category: string; likesCount: number; repliesCount: number; createdAt: string }[];
}
