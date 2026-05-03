export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, created, unauthorized, validationError } from "@/lib/api-helpers";
import { createPostSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const posts = await prisma.communityPost.findMany({
    where: {
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return success(posts);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const post = await prisma.communityPost.create({
    data: { ...parsed.data, userId: user.id },
  });

  return created(post);
}
