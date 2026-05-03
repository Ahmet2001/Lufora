export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound } from "@/lib/api-helpers";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plant = await prisma.plant.findFirst({ where: { id: params.id, userId: user.id } });
  if (!plant) return notFound("Plant");

  const logs = await prisma.plantHealthLog.findMany({
    where: { plantId: params.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return success(logs);
}
