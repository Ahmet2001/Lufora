export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound, validationError } from "@/lib/api-helpers";
import { updateTaskSchema } from "@/lib/validations";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const task = await prisma.plantTask.findFirst({ where: { id: params.id, userId: user.id } });
  if (!task) return notFound("Task");

  const body = await req.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.plantTask.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      ...(parsed.data.dueDate && { dueDate: new Date(parsed.data.dueDate) }),
    },
  });

  return success(updated);
}
