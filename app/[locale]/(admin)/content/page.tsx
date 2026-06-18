import type { SearchParams } from "nuqs/server";
import type { Prisma } from "@/lib/generated/prisma/client";
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
              <th className="p-3">Nadpis</th>
              <th className="p-3">Typ</th>
              <th className="p-3">Stav</th>
              <th className="p-3">Upraveno</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-ink-muted">
                  Zatím žádný obsah.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
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
