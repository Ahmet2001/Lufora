export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, created, unauthorized, validationError } from "@/lib/api-helpers";
import { createGrowJourneySchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const journeys = await prisma.growJourney.findMany({
    where: { userId: user.id },
    include: {
      _count: { select: { photos: true, milestones: true, tasks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return success(journeys);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = createGrowJourneySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const journey = await prisma.growJourney.create({
    data: { ...parsed.data, userId: user.id },
  });

  return created(journey);
}
