import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Lufora database...\n");

  // ─── BADGES ───
  const badges = await Promise.all([
    prisma.badge.upsert({ where: { code: "seedling" }, update: {}, create: { code: "seedling", name: "Seedling", description: "Registered an account", category: "plant_care", icon: "🌱", pointsReward: 10 } }),
    prisma.badge.upsert({ where: { code: "plant_parent" }, update: {}, create: { code: "plant_parent", name: "Plant Parent", description: "Added your first plant", category: "plant_care", icon: "🪴", pointsReward: 20 } }),
    prisma.badge.upsert({ where: { code: "plant_collector" }, update: {}, create: { code: "plant_collector", name: "Plant Collector", description: "Added 5 plants to your collection", category: "plant_care", icon: "🌿", pointsReward: 50 } }),
    prisma.badge.upsert({ where: { code: "seed_starter" }, update: {}, create: { code: "seed_starter", name: "Seed Starter", description: "Started your first grow journey", category: "grow_journey", icon: "🌰", pointsReward: 20 } }),
    prisma.badge.upsert({ where: { code: "hydration_hero" }, update: {}, create: { code: "hydration_hero", name: "Hydration Hero", description: "Completed 10 watering tasks", category: "plant_care", icon: "💧", pointsReward: 30 } }),
    prisma.badge.upsert({ where: { code: "green_thumb" }, update: {}, create: { code: "green_thumb", name: "Green Thumb", description: "Reached 500 points", category: "plant_care", icon: "🌿", pointsReward: 50 } }),
    prisma.badge.upsert({ where: { code: "bloom_master" }, update: {}, create: { code: "bloom_master", name: "Bloom Master", description: "Completed a Grow Journey", category: "grow_journey", icon: "🌻", pointsReward: 100 } }),
    prisma.badge.upsert({ where: { code: "community_star" }, update: {}, create: { code: "community_star", name: "Community Star", description: "Created 5 community posts", category: "community", icon: "⭐", pointsReward: 30 } }),
    prisma.badge.upsert({ where: { code: "streak_keeper" }, update: {}, create: { code: "streak_keeper", name: "Streak Keeper", description: "Maintained a 7-day task streak", category: "streak", icon: "🔥", pointsReward: 40 } }),
    prisma.badge.upsert({ where: { code: "task_machine" }, update: {}, create: { code: "task_machine", name: "Task Machine", description: "Completed 50 tasks", category: "plant_care", icon: "⚡", pointsReward: 50 } }),
    prisma.badge.upsert({ where: { code: "dedicated_grower" }, update: {}, create: { code: "dedicated_grower", name: "Dedicated Grower", description: "Completed 100 tasks", category: "plant_care", icon: "🏆", pointsReward: 100 } }),
    prisma.badge.upsert({ where: { code: "photographer" }, update: {}, create: { code: "photographer", name: "Photographer", description: "Added 10 plant or journey photos", category: "plant_care", icon: "📸", pointsReward: 30 } }),
    prisma.badge.upsert({ where: { code: "first_sprout" }, update: {}, create: { code: "first_sprout", name: "First Sprout", description: "Witnessed your first sprout in a grow journey", category: "grow_journey", icon: "🌱", pointsReward: 25 } }),
    prisma.badge.upsert({ where: { code: "seed_to_plant" }, update: {}, create: { code: "seed_to_plant", name: "Seed to Plant", description: "Moved a grow journey to My Plants", category: "grow_journey", icon: "🌳", pointsReward: 100 } }),
  ]);
  console.log(`✅ ${badges.length} badges seeded`);

  // ─── USERS ───
  const ada = await prisma.user.upsert({
    where: { email: "ada@lufora.app" },
    update: {},
    create: { name: "Ada Green", email: "ada@lufora.app", totalPoints: 740, level: 4, currentStreak: 5 },
  });

  const leaderboardUsers = await Promise.all([
    prisma.user.upsert({ where: { email: "sofia@lufora.app" }, update: {}, create: { name: "Sofia Fern", email: "sofia@lufora.app", totalPoints: 2340, level: 12, currentStreak: 14 } }),
    prisma.user.upsert({ where: { email: "leo@lufora.app" }, update: {}, create: { name: "Leo Vine", email: "leo@lufora.app", totalPoints: 2100, level: 11, currentStreak: 10 } }),
    prisma.user.upsert({ where: { email: "rosa@lufora.app" }, update: {}, create: { name: "Rosa Bloom", email: "rosa@lufora.app", totalPoints: 1890, level: 10, currentStreak: 8 } }),
    prisma.user.upsert({ where: { email: "kai@lufora.app" }, update: {}, create: { name: "Kai Moss", email: "kai@lufora.app", totalPoints: 1650, level: 9, currentStreak: 6 } }),
    prisma.user.upsert({ where: { email: "ivy@lufora.app" }, update: {}, create: { name: "Ivy Reed", email: "ivy@lufora.app", totalPoints: 680, level: 4, currentStreak: 3 } }),
    prisma.user.upsert({ where: { email: "maria@lufora.app" }, update: {}, create: { name: "Maria Flora", email: "maria@lufora.app", totalPoints: 520, level: 3, currentStreak: 2 } }),
    prisma.user.upsert({ where: { email: "james@lufora.app" }, update: {}, create: { name: "James Root", email: "james@lufora.app", totalPoints: 410, level: 3, currentStreak: 1 } }),
    prisma.user.upsert({ where: { email: "lily@lufora.app" }, update: {}, create: { name: "Lily Bloom", email: "lily@lufora.app", totalPoints: 350, level: 2, currentStreak: 4 } }),
  ]);
  console.log(`✅ ${leaderboardUsers.length + 1} users seeded`);

  // ─── ADA'S BADGES ───
  const adaBadgeCodes = ["seedling", "plant_parent", "seed_starter", "hydration_hero"];
  for (const code of adaBadgeCodes) {
    const badge = badges.find((b) => b.code === code);
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: ada.id, badgeId: badge.id } },
        update: {},
        create: { userId: ada.id, badgeId: badge.id },
      });
    }
  }
  console.log("✅ Ada's badges seeded");

  // ─── PLANTS ───
  const plants = await Promise.all([
    prisma.plant.create({ data: { userId: ada.id, nickname: "Pasha", species: "Monstera deliciosa", roomLocation: "Living room", lightLevel: "Bright indirect", hasDrainage: true, city: "Istanbul", healthScore: 72, lastWateredAt: new Date("2025-04-28") } }),
    prisma.plant.create({ data: { userId: ada.id, nickname: "Sunny", species: "Echinocactus grusonii", roomLocation: "Balcony", lightLevel: "Full sun", hasDrainage: true, city: "Istanbul", healthScore: 88 } }),
    prisma.plant.create({ data: { userId: ada.id, nickname: "Luna", species: "Phalaenopsis", roomLocation: "Bathroom", lightLevel: "Bright indirect", hasDrainage: true, city: "Istanbul", healthScore: 81, lastWateredAt: new Date("2025-04-27") } }),
    prisma.plant.create({ data: { userId: ada.id, nickname: "Ivy", species: "Epipremnum aureum", roomLocation: "Bedroom", lightLevel: "Low to bright indirect", hasDrainage: true, city: "Istanbul", healthScore: 95, lastWateredAt: new Date("2025-04-25") } }),
  ]);
  console.log(`✅ ${plants.length} plants seeded`);

  // ─── PLANT HEALTH LOGS ───
  const pasha = plants[0];
  await prisma.plantHealthLog.createMany({
    data: [
      { plantId: pasha.id, score: 72, status: "needs_attention", aiSummary: "Slight yellowing on lower leaves", createdAt: new Date("2025-04-28") },
      { plantId: pasha.id, score: 78, status: "healthy", createdAt: new Date("2025-04-21") },
      { plantId: pasha.id, score: 82, status: "healthy", aiSummary: "Looking good after repotting", createdAt: new Date("2025-04-14") },
      { plantId: pasha.id, score: 86, status: "healthy", createdAt: new Date("2025-04-07") },
      { plantId: pasha.id, score: 90, status: "excellent", aiSummary: "New leaf unfurling", createdAt: new Date("2025-03-31") },
    ],
  });
  console.log("✅ Plant health logs seeded");

  // ─── PLANT GROWTH PHOTOS ───
  await prisma.plantGrowthPhoto.createMany({
    data: [
      { plantId: pasha.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Pasha+Jan", note: "Just brought home", createdAt: new Date("2025-01-10") },
      { plantId: pasha.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Pasha+Mar", note: "New leaf!", createdAt: new Date("2025-03-15") },
      { plantId: pasha.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Pasha+Apr", note: "After repotting", createdAt: new Date("2025-04-14") },
    ],
  });
  console.log("✅ Plant photos seeded");

  // ─── GROW JOURNEYS ───
  const basilJourney = await prisma.growJourney.create({
    data: { userId: ada.id, plantName: "Basil", startingType: "seed", currentStage: "seedling", dayNumber: 12, progressPercent: 38, environmentType: "indoor", city: "Istanbul", lightLevel: "Bright indirect", growingMedium: "Seed starting mix", containerType: "Starter tray", pointsEarned: 95, startedAt: new Date("2025-04-18") },
  });

  const avocadoJourney = await prisma.growJourney.create({
    data: { userId: ada.id, plantName: "Avocado", startingType: "seed", currentStage: "germination", dayNumber: 24, progressPercent: 18, environmentType: "indoor", city: "Istanbul", lightLevel: "Bright indirect", growingMedium: "Water (toothpick method)", containerType: "Glass jar", pointsEarned: 30, startedAt: new Date("2025-04-06") },
  });
  console.log("✅ Grow journeys seeded");

  // ─── JOURNEY PHOTOS ───
  await prisma.growJourneyPhoto.createMany({
    data: [
      { growJourneyId: basilJourney.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Basil+Day1", note: "Seeds planted in starter tray", stage: "setup", createdAt: new Date("2025-04-18") },
      { growJourneyId: basilJourney.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Basil+Sprout", note: "First sprouts visible!", stage: "germination", createdAt: new Date("2025-04-25") },
      { growJourneyId: basilJourney.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Basil+Seedling", note: "Seedling 2cm tall", stage: "seedling", createdAt: new Date("2025-04-28") },
      { growJourneyId: avocadoJourney.id, imageUrl: "https://placehold.co/400x400/22c55e/white?text=Avocado+Start", note: "Avocado seed in water", stage: "setup", createdAt: new Date("2025-04-06") },
    ],
  });
  console.log("✅ Journey photos seeded");

  // ─── JOURNEY MILESTONES ───
  await prisma.growJourneyMilestone.createMany({
    data: [
      { growJourneyId: basilJourney.id, title: "Seeds planted", stage: "setup", points: 10, reachedAt: new Date("2025-04-18") },
      { growJourneyId: basilJourney.id, title: "First sprout visible", stage: "germination", points: 50, badgeCode: "first_sprout", reachedAt: new Date("2025-04-25") },
      { growJourneyId: basilJourney.id, title: "First true leaves", stage: "seedling", points: 30 },
      { growJourneyId: basilJourney.id, title: "Transplanted to main pot", stage: "pot_transfer", points: 40 },
      { growJourneyId: basilJourney.id, title: "Established growth", stage: "young_plant", points: 50 },
      { growJourneyId: basilJourney.id, title: "Mature plant", stage: "mature_plant", points: 100, badgeCode: "bloom_master" },
      { growJourneyId: avocadoJourney.id, title: "Seed in water", stage: "setup", points: 10, reachedAt: new Date("2025-04-06") },
      { growJourneyId: avocadoJourney.id, title: "First root visible", stage: "germination", points: 50, badgeCode: "first_sprout" },
      { growJourneyId: avocadoJourney.id, title: "Stem sprouts", stage: "sprout", points: 30 },
    ],
  });
  console.log("✅ Journey milestones seeded");

  // ─── TASKS ───
  const today = new Date();
  today.setHours(8, 0, 0, 0);

  await prisma.plantTask.createMany({
    data: [
      { userId: ada.id, plantId: pasha.id, title: "Water Monstera", type: "watering", dueDate: today, points: 10, description: "Give Pasha a thorough watering" },
      { userId: ada.id, plantId: plants[1].id, title: "Check cactus light exposure", type: "health_check", dueDate: new Date(today.getTime() + 3600000), points: 10, description: "Ensure Sunny gets enough sunlight" },
      { userId: ada.id, plantId: plants[2].id, title: "Update orchid photo", type: "photo_update", dueDate: new Date(today.getTime() + 7200000), points: 20, description: "Take a new photo of Luna" },
      { userId: ada.id, growJourneyId: basilJourney.id, title: "Check basil seedling moisture", type: "soil_check", dueDate: new Date(today.getTime() + 3600000), points: 5, description: "Mist the basil seedlings gently" },
      { userId: ada.id, growJourneyId: basilJourney.id, title: "Add grow journey photo", type: "photo_update", dueDate: new Date(today.getTime() + 10800000), points: 15, description: "Take a progress photo of your basil seedling" },
      { userId: ada.id, growJourneyId: basilJourney.id, title: "Mark first true leaves", type: "grow_milestone", dueDate: new Date(today.getTime() + 2 * 86400000), points: 50, description: "Log when you see the first true leaves" },
      { userId: ada.id, plantId: pasha.id, title: "Check soil moisture", type: "soil_check", dueDate: new Date(today.getTime() - 3600000), points: 10, status: "completed", completedAt: new Date(today.getTime() - 2700000), description: "Press finger 1 inch into soil" },
      { userId: ada.id, plantId: pasha.id, title: "Clean Monstera leaves", type: "leaf_cleaning", dueDate: new Date(today.getTime() + 14400000), points: 15, description: "Wipe dust off Monstera leaves" },
      { userId: ada.id, plantId: plants[3].id, title: "Check Pothos growth", type: "health_check", dueDate: new Date(today.getTime() + 86400000), points: 10 },
      { userId: ada.id, growJourneyId: avocadoJourney.id, title: "Check avocado water level", type: "soil_check", dueDate: today, points: 5, description: "Ensure seed is half submerged" },
      { userId: ada.id, growJourneyId: avocadoJourney.id, title: "Replace avocado water", type: "watering", dueDate: new Date(today.getTime() + 2 * 86400000), points: 10, description: "Change water every 3 days" },
      { userId: ada.id, plantId: pasha.id, title: "Add weekly Monstera photo", type: "photo_update", dueDate: new Date(today.getTime() + 86400000), points: 20 },
    ],
  });
  console.log("✅ Tasks seeded");

  // ─── COMMUNITY POSTS ───
  const maria = leaderboardUsers[5]; // Maria Flora
  const james = leaderboardUsers[6]; // James Root
  const lily = leaderboardUsers[7]; // Lily Bloom

  const posts = await Promise.all([
    prisma.communityPost.create({ data: { userId: maria.id, title: "Why are my Monstera leaves turning yellow?", content: "I water once a week and keep it in indirect light. The lower leaves started yellowing last week. Is this normal?", category: "save_my_plant", hasAiAnalysis: true, aiAnalysisSummary: "Likely overwatering — reduce frequency and check drainage.", likesCount: 34, repliesCount: 3, createdAt: new Date("2025-04-29T14:00:00") } }),
    prisma.communityPost.create({ data: { userId: james.id, title: "My avocado seed finally sprouted after 24 days!", content: "Used the toothpick method and changed water every 3 days. Today I saw the first crack and a tiny root!", category: "my_first_sprout", likesCount: 67, repliesCount: 4, createdAt: new Date("2025-04-28T09:00:00") } }),
    prisma.communityPost.create({ data: { userId: lily.id, title: "Is my basil seedling too leggy?", content: "My basil seedling is about 3 inches tall but the stem is very thin and leaning to one side. Should I add more light?", category: "seedling_help", hasAiAnalysis: true, aiAnalysisSummary: "Likely insufficient light — move closer to window or add grow light.", likesCount: 15, repliesCount: 2, createdAt: new Date("2025-04-27T16:30:00") } }),
    prisma.communityPost.create({ data: { userId: ada.id, title: "Best soil mix for indoor Monstera?", content: "Looking for recommendations on potting mix for my Monstera. Currently using regular potting soil but thinking of switching.", category: "soil_pots", likesCount: 22, repliesCount: 3, createdAt: new Date("2025-04-26T11:00:00") } }),
    prisma.communityPost.create({ data: { userId: leaderboardUsers[0].id, title: "Before and after: My Fiddle Leaf Fig recovery", content: "6 months ago my FLF was dropping leaves like crazy. Here is the transformation after adjusting light and watering.", category: "before_after", likesCount: 89, repliesCount: 5, createdAt: new Date("2025-04-25T08:00:00") } }),
    prisma.communityPost.create({ data: { userId: leaderboardUsers[1].id, title: "Complete beginner guide to propagating Pothos", content: "Step by step guide on how to propagate your Pothos in water. Super easy and great for beginners!", category: "propagation", likesCount: 45, repliesCount: 4, createdAt: new Date("2025-04-24T15:00:00") } }),
    prisma.communityPost.create({ data: { userId: leaderboardUsers[2].id, title: "Starting tomato seeds indoors — tips?", content: "Planning to start tomato seeds indoors next week. Any tips on soil temperature, lighting, and when to transplant?", category: "seed_to_plant", likesCount: 31, repliesCount: 6, createdAt: new Date("2025-04-23T10:00:00") } }),
  ]);
  console.log(`✅ ${posts.length} community posts seeded`);

  // ─── COMMUNITY REPLIES ───
  await prisma.communityReply.createMany({
    data: [
      { postId: posts[0].id, userId: ada.id, content: "I had the same issue! Reducing watering from weekly to every 10 days fixed it for me.", likesCount: 8 },
      { postId: posts[0].id, userId: leaderboardUsers[0].id, content: "Check the drainage holes. Standing water in the saucer can cause root issues.", isExperiencedUser: true, likesCount: 12 },
      { postId: posts[0].id, userId: leaderboardUsers[1].id, content: "Try using a moisture meter — it takes the guesswork out of watering.", likesCount: 5 },
      { postId: posts[1].id, userId: ada.id, content: "Congratulations! The toothpick method works great. Make sure to change the water regularly.", likesCount: 15 },
      { postId: posts[1].id, userId: lily.id, content: "Amazing! How long did it take for the root to appear after the crack?", likesCount: 3 },
      { postId: posts[1].id, userId: leaderboardUsers[2].id, content: "Well done! Once the root is 2-3 inches long, you can plant it in soil.", isExperiencedUser: true, likesCount: 9 },
      { postId: posts[1].id, userId: maria.id, content: "I am on day 18 with my avocado. Still waiting for the crack. This gives me hope!", likesCount: 7 },
      { postId: posts[2].id, userId: leaderboardUsers[3].id, content: "Leggy seedlings usually mean not enough light. Try moving it closer to a south-facing window.", isExperiencedUser: true, likesCount: 6 },
      { postId: posts[2].id, userId: ada.id, content: "You could also try a small fan on low — the gentle breeze strengthens stems.", likesCount: 4 },
      { postId: posts[3].id, userId: leaderboardUsers[0].id, content: "I use 50% peat moss, 25% perlite, 25% orchid bark. Works amazing for Monsteras.", isExperiencedUser: true, likesCount: 10 },
      { postId: posts[3].id, userId: leaderboardUsers[4].id, content: "Regular potting soil retains too much moisture. Definitely add perlite for drainage.", likesCount: 6 },
      { postId: posts[3].id, userId: james.id, content: "I just use cactus mix + perlite. Simple and effective.", likesCount: 4 },
    ],
  });
  console.log("✅ Community replies seeded");

  // ─── POINT TRANSACTIONS ───
  await prisma.pointTransaction.createMany({
    data: [
      { userId: ada.id, sourceType: "badge", points: 10, reason: "Badge unlocked: Seedling" },
      { userId: ada.id, sourceType: "badge", points: 20, reason: "Badge unlocked: Plant Parent" },
      { userId: ada.id, sourceType: "badge", points: 20, reason: "Badge unlocked: Seed Starter" },
      { userId: ada.id, sourceType: "badge", points: 30, reason: "Badge unlocked: Hydration Hero" },
      { userId: ada.id, sourceType: "task", points: 10, reason: "Completed: Check soil moisture" },
      { userId: ada.id, sourceType: "task", points: 10, reason: "Completed: Water Monstera" },
      { userId: ada.id, sourceType: "grow_milestone", points: 10, reason: "Milestone: Seeds planted" },
      { userId: ada.id, sourceType: "grow_milestone", points: 50, reason: "Milestone: First sprout visible" },
    ],
  });
  console.log("✅ Point transactions seeded");

  console.log("\n🌿 Seeding complete! Lufora is ready.\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
