export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { success } from "@/lib/api-helpers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "weekly";

  // Period filtering could be added with PointTransaction aggregation
  // For now, we rank by totalPoints which is the lifetime score
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      totalPoints: true,
      level: true,
      currentStreak: true,
      _count: {
        select: {
          badges: true,
          tasks: { where: { status: "completed" } },
          communityPosts: true,
        },
      },
    },
    orderBy: { totalPoints: "desc" },
    take: 50,
  });

  const leaderboard = users.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    points: u.totalPoints,
    level: u.level,
    streak: u.currentStreak,
    badges: u._count.badges,
    tasks: u._count.tasks,
    posts: u._count.communityPosts,
  }));

  return success({ period, leaderboard });
}
