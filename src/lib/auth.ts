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

export const authOptions: NextAuthOptions = {
  providers: [
    // Phase 2: CredentialsProvider will be added here
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     // Validate against DB with bcrypt
    //   },
    // }),
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
