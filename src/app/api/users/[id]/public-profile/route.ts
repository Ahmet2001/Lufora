export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { success, notFound } from "@/lib/api-helpers";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          badges: true,
          plants: true,
          growJourneys: true,
          communityPosts: true,
        }
      }
    }
  });

  if (!user) return notFound("User");

  // Private profile state: return limited info
  if (!user.isPublicProfile) {
    return success({
      isPrivate: true,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      }
    });
  }

  // Public profile state: return full public info
  const badges = await prisma.userBadge.findMany({
    where: { userId: params.id },
    include: { badge: true },
    orderBy: { unlockedAt: "desc" },
    take: 5,
  });

  const plants = await prisma.plant.findMany({
    where: { userId: params.id, status: "active" },
    select: {
      id: true, nickname: true, species: true, imageUrl: true, healthScore: true, status: true
    },
    take: 5,
  });

  const growJourneys = await prisma.growJourney.findMany({
    where: { userId: params.id },
    select: {
      id: true, plantName: true, startingType: true, currentStage: true, progressPercent: true, dayNumber: true
    },
    take: 3,
  });

  const posts = await prisma.communityPost.findMany({
    where: { userId: params.id },
    select: {
      id: true, title: true, category: true, likesCount: true, repliesCount: true, createdAt: true
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return success({
    isPrivate: false,
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      level: user.level,
      totalPoints: user.totalPoints,
      currentStreak: user.currentStreak,
      createdAt: user.createdAt,
      stats: user._count,
    },
    badges: badges.map(b => b.badge),
    plants,
    growJourneys,
    posts,
  });
}
