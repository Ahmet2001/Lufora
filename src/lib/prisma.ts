import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client singleton for serverless environments.
 *
 * In development, we store the client on `globalThis` to prevent
 * creating a new connection on every hot-reload.
 *
 * In production (serverless), each function invocation gets a fresh
 * module scope, but the connection is reused within the same
 * Lambda/Edge container lifetime.
 *
 * For best results with Neon/Supabase, use a POOLED connection string
 * in DATABASE_URL (e.g., Neon's `-pooler` endpoint or Supabase's
 * port 6543 pooler).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
