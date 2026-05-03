import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "./prisma";

/**
 * Get current authenticated user from NextAuth session.
 * Returns null if not logged in.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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

/**
 * Convenience method to just get the user ID if we don't need the whole record.
 */
export async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  // Using the custom added session.user.id if available, otherwise fallback
  if (session?.user && "id" in session.user) {
    return session.user.id as string;
  }
  return null;
}
