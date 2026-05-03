export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, validationError } from "@/lib/api-helpers";
import { updateProfileSchema } from "@/lib/validations";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      badges: { include: { badge: true }, orderBy: { unlockedAt: "desc" } },
    },
  });

  if (profile) {
    // @ts-expect-error - removing passwordHash
    delete profile.passwordHash;
  }

  return success(profile);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  // @ts-expect-error - removing passwordHash
  delete updated.passwordHash;

  return success(updated);
}
