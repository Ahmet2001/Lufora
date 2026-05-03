export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound, validationError } from "@/lib/api-helpers";
import { updatePlantSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plant = await prisma.plant.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      healthLogs: { orderBy: { createdAt: "desc" }, take: 10 },
      growthPhotos: { orderBy: { createdAt: "desc" }, take: 20 },
      tasks: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!plant) return notFound("Plant");
  return success(plant);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plant = await prisma.plant.findFirst({ where: { id: params.id, userId: user.id } });
  if (!plant) return notFound("Plant");

  const body = await req.json();
  const parsed = updatePlantSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.plant.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return success(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plant = await prisma.plant.findFirst({ where: { id: params.id, userId: user.id } });
  if (!plant) return notFound("Plant");

  await prisma.plant.delete({ where: { id: params.id } });
  return success({ deleted: true });
}
