import db from "@/lib/db";

const PER_PAGE = 9;

export async function getPublishedPosts({
  locale,
  page = 1,
  perPage = PER_PAGE,
}: {
  locale: string;
  page?: number;
  perPage?: number;
}) {
  const where = {
    type: "BLOG_POST" as const,
    status: "PUBLISHED" as const,
    locale,
  };
  const [items, total] = await Promise.all([
    db.content.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.content.count({ where }),
  ]);
  return { items, total, page, perPage, pages: Math.ceil(total / perPage) };
}

export async function getLatestPosts(locale: string, take = 3) {
  return db.content.findMany({
    where: { type: "BLOG_POST", status: "PUBLISHED", locale },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getPostBySlug(locale: string, slug: string) {
  return db.content.findUnique({
    where: { type_locale_slug: { type: "BLOG_POST", locale, slug } },
  });
}

export async function getAllPublishedPostSlugs(locale: string) {
  const rows = await db.content.findMany({
    where: { type: "BLOG_POST", status: "PUBLISHED", locale },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
