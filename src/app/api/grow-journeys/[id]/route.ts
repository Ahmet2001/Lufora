export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound, validationError } from "@/lib/api-helpers";
import { updateGrowJourneySchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const journey = await prisma.growJourney.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      photos: { orderBy: { createdAt: "desc" } },
      milestones: { orderBy: { createdAt: "asc" } },
      tasks: { orderBy: { dueDate: "asc" } },
    },
  });

  if (!journey) return notFound("Grow Journey");
  return success(journey);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const journey = await prisma.growJourney.findFirst({ where: { id: params.id, userId: user.id } });
  if (!journey) return notFound("Grow Journey");

  const body = await req.json();
  const parsed = updateGrowJourneySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.growJourney.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return success(updated);
}
