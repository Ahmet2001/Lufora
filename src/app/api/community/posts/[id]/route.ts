export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, notFound, validationError } from "@/lib/api-helpers";
import { updatePostSchema } from "@/lib/validations";

export async function GET(_req: Request, { params }: { params: { id: string } }) {

  const post = await prisma.communityPost.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      replies: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) return notFound("Post");
  return success(post);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const post = await prisma.communityPost.findFirst({ where: { id: params.id, userId: user.id } });
  if (!post) return notFound("Post");

  const body = await req.json();
  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.communityPost.update({
    where: { id: params.id },
    data: parsed.data,
  });

  return success(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const post = await prisma.communityPost.findFirst({ where: { id: params.id, userId: user.id } });
  if (!post) return notFound("Post");

  await prisma.communityPost.delete({ where: { id: params.id } });
  return success({ deleted: true });
}
