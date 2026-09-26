import type { MetadataRoute } from "next";
import { getAllPublishedPostSlugs } from "@/lib/cms/blog";
import { getAllFaqSlugs } from "@/lib/cms/faq";
import { ROUTES } from "@/lib/site/nav";
import { REPORTS } from "@/lib/content/annual-reports";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sosvyzivne.cz"
).replace(/\/+$/, "");

// Every public route except search, plus one page per annual report.
const STATIC_PATHS = [
  ...ROUTES.filter((r) => r !== "/hledat").map((r) => (r === "/" ? "" : r)),
  ...REPORTS.map((r) => `/vyrocni-zpravy/${r.year}`),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${baseUrl}${p}`,
    changeFrequency: "weekly",
  }));

  try {
    const [posts, faqs] = await Promise.all([
      getAllPublishedPostSlugs("cs"),
      getAllFaqSlugs("cs"),
    ]);
    for (const slug of posts) entries.push({ url: `${baseUrl}/blog/${slug}` });
    for (const slug of faqs) entries.push({ url: `${baseUrl}/faq/${slug}` });
  } catch (err) {
    console.error("[sitemap] failed to load dynamic routes, emitting static only:", err);
  }

  return entries;
}
