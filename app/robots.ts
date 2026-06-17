import type { MetadataRoute } from "next";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sosvyzivne.cz"
).replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/content", "/users", "/media", "/login", "/hledat"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
