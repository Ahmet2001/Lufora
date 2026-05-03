import { z } from "zod";

// ─── Plant ───
export const createPlantSchema = z.object({
  nickname: z.string().min(1, "Nickname is required").max(50),
  species: z.string().max(100).optional(),
  imageUrl: z.string().url().optional(),
  roomLocation: z.string().max(50).optional(),
  lightLevel: z.string().max(30).optional(),
  hasDrainage: z.boolean().optional(),
  city: z.string().max(50).optional(),
});

export const updatePlantSchema = createPlantSchema.partial();

// ─── Task ───
export const createTaskSchema = z.object({
  plantId: z.string().cuid().optional(),
  growJourneyId: z.string().cuid().optional(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum([
    "watering", "soil_check", "photo_update", "leaf_cleaning",
    "fertilizing", "health_check", "grow_milestone",
    "grow_environment_check", "custom",
  ]),
  dueDate: z.string().datetime(),
  points: z.number().int().min(0).max(500).optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["pending", "completed", "skipped"]).optional(),
});

// ─── Grow Journey ───
export const createGrowJourneySchema = z.object({
  plantName: z.string().min(1, "Plant name is required").max(50),
  startingType: z.enum(["seed", "seedling", "cutting", "bulb_tuber"]),
  imageUrl: z.string().url().optional(),
  environmentType: z.string().max(30).optional(),
  city: z.string().max(50).optional(),
  lightLevel: z.string().max(30).optional(),
  growingMedium: z.string().max(50).optional(),
  containerType: z.string().max(50).optional(),
});

export const updateGrowJourneySchema = z.object({
  currentStage: z.enum([
    "setup", "germination", "sprout", "seedling",
    "pot_transfer", "young_plant", "mature_plant",
  ]).optional(),
  dayNumber: z.number().int().min(1).optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
  status: z.enum(["active", "completed", "paused"]).optional(),
});

// ─── Community Post ───
export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(5000),
  category: z.enum([
    "save_my_plant", "grow_journey", "seed_to_plant", "propagation",
    "seedling_help", "beginners", "before_after", "care_tips",
    "plant_suggestions", "soil_pots", "my_first_sprout",
  ]),
  plantId: z.string().cuid().optional(),
  growJourneyId: z.string().cuid().optional(),
  imageUrl: z.string().url().optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const createReplySchema = z.object({
  content: z.string().min(1, "Reply content is required").max(2000),
});

// ─── AI Requests ───
export const identifyPlantSchema = z.object({
  imageUrl: z.string().optional(),
  description: z.string().min(1).max(500),
});

export const carePlanSchema = z.object({
  species: z.string().min(1),
  roomLocation: z.string().optional(),
  lightLevel: z.string().optional(),
});

export const plantDoctorSchema = z.object({
  plantName: z.string().min(1),
  species: z.string().optional(),
  symptoms: z.string().min(1).max(1000),
  imageUrl: z.string().optional(),
});

export const growPlanSchema = z.object({
  plantName: z.string().min(1),
  startingType: z.enum(["seed", "seedling", "cutting", "bulb_tuber"]),
  environmentType: z.string().optional(),
});

export const growGuideSchema = z.object({
  plantName: z.string().min(1),
  currentStage: z.string().min(1),
  dayNumber: z.number().int().min(1),
  question: z.string().min(1).max(1000),
});

// ─── Profile ───
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
});
