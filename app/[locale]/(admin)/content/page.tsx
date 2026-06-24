import type { SearchParams } from "nuqs/server";
import type { Prisma } from "@/lib/generated/prisma/client";
import { ImageOff } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ContentFilters } from "@/components/cms/content-filters";
import {
  loadContentFilter,
  CONTENT_FILTER_TO_TYPE,
  STATUS_FILTER_TO_STATUS,
} from "@/lib/cms/content-filter";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { type: typeFilter, status: statusFilter } =
    await loadContentFilter(searchParams);
  const where: Prisma.ContentWhereInput = {};
  if (typeFilter !== "all") where.type = CONTENT_FILTER_TO_TYPE[typeFilter];
  if (statusFilter !== "all")
    where.status = STATUS_FILTER_TO_STATUS[statusFilter];

  let rows: Array<{
    id: string;
    type: string;
    status: string;
    title: string;
    slug: string;
    coverImage: string | null;
    updatedAt: Date;
  }> = [];
  try {
    rows = await db.content.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        type: true,
        status: true,
        title: true,
        slug: true,
        coverImage: true,
        updatedAt: true,
      },
    });
  } catch (err) {
    console.error("[admin/content] failed to load content list:", err);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-accent">Obsah</h1>
        <Button asChild size="sm">
          <Link href="/content/new">+ Nový obsah</Link>
        </Button>
      </div>

      <div className="mt-6">
        <ContentFilters />
      </div>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-left text-ink-muted">
            <tr>
              <th className="p-3">Náhled</th>
              <th className="p-3">Nadpis</th>
              <th className="p-3">Typ</th>
              <th className="p-3">Stav</th>
              <th className="p-3">Upraveno</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-ink-muted">
                  Zatím žádný obsah.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">
                  {r.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.coverImage}
                      alt=""
                      className="h-10 w-16 rounded-[var(--radius-sm)] border border-border object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-10 w-16 items-center justify-center rounded-[var(--radius-sm)] border border-dashed border-border text-ink-muted"
                      aria-hidden="true"
                    >
                      <ImageOff className="size-4" />
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <Link href={`/content/${r.id}/edit`} className="text-accent hover:underline">
                    {r.title}
                  </Link>
                </td>
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-ink-muted">
                  {r.updatedAt.toLocaleDateString("cs-CZ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
