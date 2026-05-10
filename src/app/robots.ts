import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lufora.netlify.app";

  return {
    rules: {
      userAgent: "*",
      // By default, everything is allowed. We just explicitly disallow private routes.
      allow: "/",
      disallow: [
        "/home",        // Private dashboard
        "/plants",      // Private plant management
        "/grow",        // Private grow journals
        "/profile",     // Private user settings
        "/calendar",    // Private calendar
        "/matchmaker",  // Private matchmaker tool
        "/api/",        // Backend API routes
        "/login",       // Auth pages don't need indexing
        "/register",    // Auth pages don't need indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
