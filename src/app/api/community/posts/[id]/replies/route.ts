export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { created, unauthorized, notFound, validationError } from "@/lib/api-helpers";
import { createReplySchema } from "@/lib/validations";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const post = await prisma.communityPost.findUnique({ where: { id: params.id } });
  if (!post) return notFound("Post");

  const body = await req.json();
  const parsed = createReplySchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const reply = await prisma.communityReply.create({
    data: {
      postId: params.id,
      userId: user.id,
      content: parsed.data.content,
    },
  });

  await prisma.communityPost.update({
    where: { id: params.id },
    data: { repliesCount: { increment: 1 } },
  });

  return created(reply);
}
