import db from "@/lib/db";

export type SearchResult = {
  id: string;
  type: "BLOG_POST" | "FAQ";
  slug: string;
  title: string;
  excerpt: string | null;
  href: string;
};

export async function searchContent(
  locale: string,
  query: string,
): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await db.content.findMany({
    where: {
      locale,
      status: "PUBLISHED",
      type: { in: ["BLOG_POST", "FAQ"] },
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
    select: { id: true, type: true, slug: true, title: true, excerpt: true },
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type as "BLOG_POST" | "FAQ",
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    href: r.type === "FAQ" ? `/faq/${r.slug}` : `/blog/${r.slug}`,
  }));
}
