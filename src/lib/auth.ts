/**
 * NextAuth.js v4 configuration.
 *
 * - Credentials provider (email + password)
 * - JWT session strategy (serverless-friendly, no DB sessions)
 * - Secure cookies auto-enabled when NEXTAUTH_URL is HTTPS
 *
 * This file will be used by the [...nextauth] route handler in Phase 2.
 * For now it exports the config skeleton.
 */

import type { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    newUser: "/register",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },

  // Secure cookies are automatically used when NEXTAUTH_URL starts with https://
  // No manual cookie config needed — NextAuth handles this.
  secret: process.env.NEXTAUTH_SECRET,
};
