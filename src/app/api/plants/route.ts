export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, created, unauthorized, validationError } from "@/lib/api-helpers";
import { createPlantSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plants = await prisma.plant.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { tasks: { where: { status: "pending" } }, growthPhotos: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return success(plants);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = createPlantSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const plant = await prisma.plant.create({
    data: { ...parsed.data, userId: user.id },
  });

  return created(plant);
}
