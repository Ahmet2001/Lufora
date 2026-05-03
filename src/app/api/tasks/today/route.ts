export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized } from "@/lib/api-helpers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await prisma.plantTask.findMany({
    where: {
      userId: user.id,
      dueDate: { gte: startOfDay, lt: endOfDay },
    },
    include: {
      plant: { select: { id: true, nickname: true, imageUrl: true } },
      growJourney: { select: { id: true, plantName: true, imageUrl: true } },
    },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  return success(tasks);
}
