export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, created, unauthorized, validationError } from "@/lib/api-helpers";
import { createTaskSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const tasks = await prisma.plantTask.findMany({
    where: {
      userId: user.id,
      ...(status && { status }),
    },
    include: {
      plant: { select: { id: true, nickname: true, imageUrl: true } },
      growJourney: { select: { id: true, plantName: true, imageUrl: true } },
    },
    orderBy: { dueDate: "asc" },
  });

  return success(tasks);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const task = await prisma.plantTask.create({
    data: {
      ...parsed.data,
      userId: user.id,
      dueDate: new Date(parsed.data.dueDate),
      points: parsed.data.points ?? 10,
    },
  });

  return created(task);
}
