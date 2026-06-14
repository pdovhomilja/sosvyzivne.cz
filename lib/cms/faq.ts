import db from "@/lib/db";
import { faqData } from "@/lib/cms/schemas";

export type FaqItem = {
  id: string;
  slug: string;
  question: string;
  answer: string;
  order: number;
  category?: string;
};

function toFaqItem(row: {
  id: string;
  slug: string;
  title: string;
  body: string;
  data: unknown;
}): FaqItem {
  const parsed = faqData.safeParse(row.data);
  const meta = parsed.success ? parsed.data : { order: 0 as number };
  return {
    id: row.id,
    slug: row.slug,
    question: row.title,
    answer: row.body,
    order: meta.order ?? 0,
    category: "category" in meta ? meta.category : undefined,
  };
}

export async function getFaqs(locale: string): Promise<FaqItem[]> {
  const rows = await db.content.findMany({
    where: { type: "FAQ", status: "PUBLISHED", locale },
    orderBy: [{ createdAt: "asc" }],
    select: { id: true, slug: true, title: true, body: true, data: true },
  });
  return rows.map(toFaqItem).sort((a, b) => a.order - b.order);
}

export async function getFaqBySlug(locale: string, slug: string) {
  const row = await db.content.findFirst({
    where: { type: "FAQ", status: "PUBLISHED", locale, slug },
    select: { id: true, slug: true, title: true, body: true, data: true },
  });
  return row ? toFaqItem(row) : null;
}

export async function getAllFaqSlugs(locale: string) {
  const rows = await db.content.findMany({
    where: { type: "FAQ", status: "PUBLISHED", locale },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
