import prisma from "./prisma";

/**
 * ┌─────────────────────────────────────────────────────────┐
 * │  ⚠️  MOCK CURRENT USER — MVP/DEMO ONLY                │
 * │                                                         │
 * │  This returns the first user in the database            │
 * │  (Ada Green from seed data) as the "logged in" user.    │
 * │                                                         │
 * │  TODO: Replace with real NextAuth session in Phase 6:   │
 * │    1. Set up NextAuth with Google/GitHub provider        │
 * │    2. Import getServerSession from next-auth             │
 * │    3. Look up user by session.user.email                 │
 * │    4. Return null if no session                          │
 * │                                                         │
 * │  Example real implementation:                            │
 * │    import { getServerSession } from "next-auth";         │
 * │    import { authOptions } from "@/app/api/auth/[...nextauth]/route"; │
 * │    const session = await getServerSession(authOptions);  │
 * │    if (!session?.user?.email) return null;               │
 * │    return prisma.user.findUnique({                       │
 * │      where: { email: session.user.email }                │
 * │    });                                                   │
 * └─────────────────────────────────────────────────────────┘
 */
export async function getCurrentUser() {
  // Mock: return first user (Ada Green from seed data)
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "asc" },
  });

  return user;
}

/**
 * Require current user or throw 401.
 */
export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
