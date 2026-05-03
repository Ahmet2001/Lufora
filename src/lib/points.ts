/**
 * Points & Badges business logic.
 */
import prisma from "./prisma";

// ─── Award Points ───
export async function awardPoints(opts: {
  userId: string;
  points: number;
  sourceType: string;
  sourceId?: string;
  reason: string;
}) {
  const [, user] = await prisma.$transaction([
    prisma.pointTransaction.create({
      data: {
        userId: opts.userId,
        sourceType: opts.sourceType,
        sourceId: opts.sourceId,
        points: opts.points,
        reason: opts.reason,
      },
    }),
    prisma.user.update({
      where: { id: opts.userId },
      data: {
        totalPoints: { increment: opts.points },
        level: undefined, // recalculated below
      },
    }),
  ]);

  // Recalculate level (every 200 points = 1 level)
  const newLevel = Math.floor(user.totalPoints / 200) + 1;
  if (newLevel !== user.level) {
    await prisma.user.update({
      where: { id: opts.userId },
      data: { level: newLevel },
    });
  }

  return user;
}

// ─── Check and Unlock Badges ───
export async function checkAndUnlockBadges(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: { include: { badge: true } },
      plants: true,
      growJourneys: true,
      tasks: { where: { status: "completed" } },
      communityPosts: true,
    },
  });

  if (!user) return [];

  const earnedCodes = new Set(user.badges.map((ub) => ub.badge.code));
  const newlyUnlocked: string[] = [];

  // Define badge conditions
  const conditions: { code: string; check: () => boolean }[] = [
    { code: "seedling", check: () => true }, // always earned on signup
    { code: "plant_parent", check: () => user.plants.length >= 1 },
    { code: "plant_collector", check: () => user.plants.length >= 5 },
    { code: "seed_starter", check: () => user.growJourneys.length >= 1 },
    { code: "hydration_hero", check: () => user.tasks.filter((t) => t.type === "watering").length >= 10 },
    { code: "green_thumb", check: () => user.totalPoints >= 500 },
    { code: "bloom_master", check: () => user.growJourneys.some((j) => j.status === "completed") },
    { code: "community_star", check: () => user.communityPosts.length >= 5 },
    { code: "streak_keeper", check: () => user.currentStreak >= 7 },
    { code: "task_machine", check: () => user.tasks.length >= 50 },
    { code: "dedicated_grower", check: () => user.tasks.length >= 100 },
    { code: "photographer", check: () => false }, // checked separately with photo count
  ];

  for (const { code, check } of conditions) {
    if (earnedCodes.has(code)) continue;
    if (!check()) continue;

    // Find badge
    const badge = await prisma.badge.findUnique({ where: { code } });
    if (!badge) continue;

    await prisma.userBadge.create({
      data: { userId, badgeId: badge.id },
    });

    // Award badge points
    if (badge.pointsReward > 0) {
      await awardPoints({
        userId,
        points: badge.pointsReward,
        sourceType: "badge",
        sourceId: badge.id,
        reason: `Badge unlocked: ${badge.name}`,
      });
    }

    newlyUnlocked.push(badge.code);
  }

  return newlyUnlocked;
}

// ─── Complete Task ───
export async function completeTask(taskId: string, userId: string) {
  const task = await prisma.plantTask.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) throw new Error("Task not found");
  if (task.status === "completed") throw new Error("Task already completed");

  const updatedTask = await prisma.plantTask.update({
    where: { id: taskId },
    data: { status: "completed", completedAt: new Date() },
  });

  // Award points
  const user = await awardPoints({
    userId,
    points: task.points,
    sourceType: "task",
    sourceId: taskId,
    reason: `Completed: ${task.title}`,
  });

  // Update streak
  await prisma.user.update({
    where: { id: userId },
    data: { currentStreak: { increment: 1 } },
  });

  // Check badges
  const newBadges = await checkAndUnlockBadges(userId);

  return { task: updatedTask, user, newBadges };
}

// ─── Complete Milestone ───
export async function completeMilestone(milestoneId: string, userId: string) {
  const milestone = await prisma.growJourneyMilestone.findUnique({
    where: { id: milestoneId },
    include: { growJourney: true },
  });

  if (!milestone) throw new Error("Milestone not found");
  if (milestone.growJourney.userId !== userId) throw new Error("Unauthorized");
  if (milestone.reachedAt) throw new Error("Milestone already completed");

  const updated = await prisma.growJourneyMilestone.update({
    where: { id: milestoneId },
    data: { reachedAt: new Date() },
  });

  // Award points
  await awardPoints({
    userId,
    points: milestone.points,
    sourceType: "grow_milestone",
    sourceId: milestoneId,
    reason: `Milestone: ${milestone.title}`,
  });

  // Update journey pointsEarned
  await prisma.growJourney.update({
    where: { id: milestone.growJourneyId },
    data: { pointsEarned: { increment: milestone.points } },
  });

  // Unlock badge if specified
  if (milestone.badgeCode) {
    const badge = await prisma.badge.findUnique({ where: { code: milestone.badgeCode } });
    if (badge) {
      const existing = await prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
      });
      if (!existing) {
        await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      }
    }
  }

  const newBadges = await checkAndUnlockBadges(userId);
  return { milestone: updated, newBadges };
}

// ─── Move Journey to Plants ───
export async function moveJourneyToPlant(journeyId: string, userId: string) {
  const journey = await prisma.growJourney.findFirst({
    where: { id: journeyId, userId },
  });

  if (!journey) throw new Error("Journey not found");
  if (journey.currentStage !== "mature_plant") {
    throw new Error("Journey must be at mature_plant stage to convert");
  }

  const [plant] = await prisma.$transaction([
    prisma.plant.create({
      data: {
        userId,
        nickname: journey.plantName,
        species: journey.plantName,
        imageUrl: journey.imageUrl,
        roomLocation: journey.environmentType,
        city: journey.city,
        lightLevel: journey.lightLevel,
        healthScore: 90,
      },
    }),
    prisma.growJourney.update({
      where: { id: journeyId },
      data: { status: "completed", completedAt: new Date() },
    }),
  ]);

  // Award completion points
  await awardPoints({
    userId,
    points: 100,
    sourceType: "grow_milestone",
    sourceId: journeyId,
    reason: `Grow Journey completed: ${journey.plantName}`,
  });

  await checkAndUnlockBadges(userId);

  return plant;
}
