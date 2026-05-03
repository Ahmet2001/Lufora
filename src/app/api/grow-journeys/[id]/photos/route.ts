export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { created, unauthorized, notFound } from "@/lib/api-helpers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const journey = await prisma.growJourney.findFirst({ where: { id: params.id, userId: user.id } });
  if (!journey) return notFound("Grow Journey");

  const body = await req.json();

  const photo = await prisma.growJourneyPhoto.create({
    data: {
      growJourneyId: params.id,
      imageUrl: body.imageUrl || "https://placehold.co/400x400/22c55e/white?text=Journey",
      note: body.note,
      stage: body.stage || journey.currentStage,
    },
  });

  return created(photo);
}
