// Types & constants for Lufora

// ─── Plant ───
export type PlantLocation = "indoor" | "outdoor" | "balcony";

// ─── Care Task ───
export type CareTaskType =
  | "water"
  | "fertilize"
  | "prune"
  | "repot"
  | "rotate"
  | "mist"
  | "check"
  | "transplant";

export const CARE_TASK_LABELS: Record<CareTaskType, string> = {
  water: "Water",
  fertilize: "Fertilize",
  prune: "Prune",
  repot: "Repot",
  rotate: "Rotate",
  mist: "Mist",
  check: "Check",
  transplant: "Transplant",
};

export const CARE_TASK_ICONS: Record<CareTaskType, string> = {
  water: "💧",
  fertilize: "🧪",
  prune: "✂️",
  repot: "🪴",
  rotate: "🔄",
  mist: "💨",
  check: "🔍",
  transplant: "🌱",
};

// ─── Grow Journey ───
export type StartType = "seed" | "seedling" | "cutting" | "bulb_tuber";

export const START_TYPE_LABELS: Record<StartType, string> = {
  seed: "Seed",
  seedling: "Seedling",
  cutting: "Cutting",
  bulb_tuber: "Bulb / Tuber",
};

export type JourneyStageKey =
  | "setup"
  | "germination"
  | "sprout"
  | "seedling"
  | "pot_transfer"
  | "young_plant"
  | "mature_plant";

export const JOURNEY_STAGES: { key: JourneyStageKey; label: string; emoji: string }[] = [
  { key: "setup", label: "Setup", emoji: "⚙️" },
  { key: "germination", label: "Germination", emoji: "🌰" },
  { key: "sprout", label: "Sprout", emoji: "🌱" },
  { key: "seedling", label: "Seedling", emoji: "🌿" },
  { key: "pot_transfer", label: "Pot Transfer", emoji: "🪴" },
  { key: "young_plant", label: "Young Plant", emoji: "🌳" },
  { key: "mature_plant", label: "Mature Plant", emoji: "🌻" },
];

export type JourneyStatus = "active" | "completed" | "abandoned";

export type JourneyPhotoType =
  | "starting"
  | "first_sprout"
  | "seedling"
  | "pot_transfer"
  | "weekly_progress";

export const PHOTO_TYPE_LABELS: Record<JourneyPhotoType, string> = {
  starting: "Starting Photo",
  first_sprout: "First Sprout",
  seedling: "Seedling",
  pot_transfer: "Pot Transfer",
  weekly_progress: "Weekly Progress",
};

// ─── Community ───
export type CommunityCategory =
  | "save_my_plant"
  | "grow_journey"
  | "seed_to_plant"
  | "propagation"
  | "seedling_help"
  | "beginners"
  | "before_after"
  | "care_tips"
  | "plant_suggestions"
  | "soil_pots"
  | "my_first_sprout";

export const COMMUNITY_CATEGORIES: { key: CommunityCategory; label: string; emoji: string }[] = [
  { key: "save_my_plant", label: "Save My Plant", emoji: "🆘" },
  { key: "grow_journey", label: "Grow Journey", emoji: "🌱" },
  { key: "seed_to_plant", label: "Seed to Plant", emoji: "🌰" },
  { key: "propagation", label: "Propagation", emoji: "✂️" },
  { key: "seedling_help", label: "Seedling Help", emoji: "🌿" },
  { key: "beginners", label: "Beginners", emoji: "📚" },
  { key: "before_after", label: "Before & After", emoji: "📸" },
  { key: "care_tips", label: "Care Tips", emoji: "💡" },
  { key: "plant_suggestions", label: "Plant Suggestions", emoji: "🪴" },
  { key: "soil_pots", label: "Soil & Pots", emoji: "🏺" },
  { key: "my_first_sprout", label: "My First Sprout", emoji: "🎉" },
];

// ─── Points ───
export const POINTS = {
  TASK_COMPLETE: 10,
  STAGE_TASK_COMPLETE: 15,
  JOURNEY_STAGE_COMPLETE: 50,
  JOURNEY_COMPLETE: 200,
  PHOTO_ADDED: 5,
  POST_CREATED: 15,
  LIKE_RECEIVED: 5,
  STREAK_7_DAY: 100,
} as const;

export type PointReason =
  | "task_complete"
  | "journey_stage"
  | "journey_complete"
  | "post_created"
  | "like_received"
  | "photo_added"
  | "streak";

// ─── Badges ───
export const BADGES = [
  { name: "Seedling", description: "Registered an account", iconEmoji: "🌱", pointsRequired: 0 },
  { name: "Plant Parent", description: "Added your first plant", iconEmoji: "🪴", pointsRequired: 0 },
  { name: "Hydration Hero", description: "Completed 10 watering tasks", iconEmoji: "💧", pointsRequired: 0 },
  { name: "Green Thumb", description: "Reached 500 points", iconEmoji: "🌿", pointsRequired: 500 },
  { name: "Bloom Master", description: "Completed your first Grow Journey", iconEmoji: "🌻", pointsRequired: 0 },
  { name: "Documenter", description: "Added 10 journey photos", iconEmoji: "📸", pointsRequired: 0 },
  { name: "Community Star", description: "Received 50 likes", iconEmoji: "🏆", pointsRequired: 0 },
  { name: "Streak Keeper", description: "Maintained a 7-day task streak", iconEmoji: "🔥", pointsRequired: 0 },
  { name: "Seed Starter", description: "Started your first journey from seed", iconEmoji: "🌰", pointsRequired: 0 },
] as const;

// ─── Navigation ───
export const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/home", icon: "Home" },
  { key: "plants", label: "My Plants", href: "/plants", icon: "Leaf" },
  { key: "grow", label: "Grow", href: "/grow", icon: "Sprout" },
  { key: "community", label: "Community", href: "/community", icon: "Users" },
  { key: "profile", label: "Profile", href: "/profile", icon: "User" },
] as const;
