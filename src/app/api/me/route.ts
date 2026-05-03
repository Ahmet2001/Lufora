export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized } from "@/lib/api-helpers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true, name: true, email: true, avatarUrl: true,
      level: true, totalPoints: true, currentStreak: true,
      createdAt: true,
      _count: {
        select: {
          plants: true, growJourneys: true, communityPosts: true,
          badges: true, tasks: { where: { status: "completed" } },
        },
      },
    },
  });

  return success(profile);
}
