export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { success } from "@/lib/api-helpers";

export async function GET() {
  const badges = await prisma.badge.findMany({
    orderBy: { category: "asc" },
  });
  return success(badges);
}
