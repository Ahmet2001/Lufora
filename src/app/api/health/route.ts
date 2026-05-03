export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/health
 *
 * Production health check endpoint.
 * Returns app status and database connectivity.
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  let dbStatus = "unknown";
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbStatus = "connected";
  } catch {
    dbStatus = "disconnected";
  }

  return NextResponse.json({
    ok: dbStatus === "connected",
    app: "Lufora",
    version: "0.1.0",
    timestamp,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    environment: process.env.NODE_ENV,
  });
}
