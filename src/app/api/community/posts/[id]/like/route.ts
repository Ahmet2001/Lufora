export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound } from "@/lib/api-helpers";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const post = await prisma.communityPost.findUnique({ where: { id: params.id } });
  if (!post) return notFound("Post");

  // Simple toggle: increment likes count
  await prisma.communityPost.update({
    where: { id: params.id },
    data: { likesCount: { increment: 1 } },
  });

  return success({ liked: true });
}
