export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized } from "@/lib/api-helpers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const badges = await prisma.userBadge.findMany({
    where: { userId: user.id },
    include: { badge: true },
    orderBy: { unlockedAt: "desc" },
  });

  return success(badges);
}
