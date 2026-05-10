import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lufora.netlify.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/community", "/login", "/register", "/leaderboard"],
      disallow: [
        "/home",
        "/plants",
        "/grow",
        "/profile",
        "/calendar",
        "/matchmaker",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
