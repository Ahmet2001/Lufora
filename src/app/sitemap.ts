import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lufora.netlify.app";

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic Community Posts
  const posts = await prisma.communityPost.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 100, // Limit to 100 most recent for the sitemap
  });

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/community/posts/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Public User Profiles
  const users = await prisma.user.findMany({
    where: { isPublicProfile: true },
    select: { id: true, updatedAt: true },
    take: 100,
  });

  const userRoutes = users.map((user) => ({
    url: `${baseUrl}/users/${user.id}`,
    lastModified: user.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...userRoutes];
}
