import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user with seed data for Phase 7
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        level: 1,
        totalPoints: 0,
        currentStreak: 0,
        isPublicProfile: true,
      },
    });

    // Optionally award a "First Account" or "Seedling" badge if it exists
    const seedlingBadge = await prisma.badge.findUnique({ where: { code: "B_START" } });
    if (seedlingBadge) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: seedlingBadge.id,
        },
      });
    }

    // Do not return passwordHash
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      level: user.level,
    };

    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
