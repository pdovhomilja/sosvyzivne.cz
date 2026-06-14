import db from "@/lib/db";
import { endorsementData } from "@/lib/cms/schemas";

export type EndorsementItem = {
  id: string;
  name: string;
  quote: string;
  role?: string;
  location?: string;
  rating: number;
  photo?: string;
  order: number;
};

export function toEndorsementItem(row: {
  id: string;
  title: string;
  body: string;
  coverImage: string | null;
  data: unknown;
}): EndorsementItem {
  const parsed = endorsementData.safeParse(row.data);
  const meta = parsed.success
    ? parsed.data
    : { order: 0, rating: 5, consent: false };
  return {
    id: row.id,
    name: row.title,
    quote: row.body,
    role: "role" in meta ? meta.role : undefined,
    location: "location" in meta ? meta.location : undefined,
    rating: meta.rating ?? 5,
    photo: row.coverImage ?? undefined,
    order: meta.order ?? 0,
  };
}

export async function getEndorsements(locale: string): Promise<EndorsementItem[]> {
  const rows = await db.content.findMany({
    where: { type: "ENDORSEMENT", status: "PUBLISHED", locale },
    orderBy: [{ createdAt: "asc" }],
    select: { id: true, title: true, body: true, coverImage: true, data: true },
  });
  return rows.map(toEndorsementItem).sort((a, b) => a.order - b.order);
}
