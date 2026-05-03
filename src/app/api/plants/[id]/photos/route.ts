export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { created, unauthorized, notFound } from "@/lib/api-helpers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const plant = await prisma.plant.findFirst({ where: { id: params.id, userId: user.id } });
  if (!plant) return notFound("Plant");

  const body = await req.json();

  const photo = await prisma.plantGrowthPhoto.create({
    data: {
      plantId: params.id,
      imageUrl: body.imageUrl || "https://placehold.co/400x400/22c55e/white?text=Photo",
      note: body.note,
    },
  });

  return created(photo);
}
