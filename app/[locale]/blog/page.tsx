import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { getPublishedPosts } from "@/lib/cms/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog – SOS výživné",
  description:
    "Články a aktuality o výživném, exekuci, náhradním výživném a péči o děti.",
};

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let data: Awaited<ReturnType<typeof getPublishedPosts>> = {
    items: [],
    total: 0,
    page,
    perPage: 9,
    pages: 0,
  };
  try {
    data = await getPublishedPosts({ locale, page });
  } catch {
    // DB not connected — render empty state.
  }

  return (
    <Section>
      <h1 className="text-3xl sm:text-4xl">Blog</h1>

      {data.items.length === 0 ? (
        <p className="mt-6 text-ink-muted">
          Zatím zde nejsou žádné články. Přidejte je v administraci (typ obsahu
          Blog).
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((p) => (
              <article
                key={p.id}
                className="flex flex-col rounded-[var(--radius-md)] border border-border bg-surface p-6"
              >
                <h2 className="text-lg">
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h2>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-muted">
                    {p.excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-auto pt-3 text-sm text-accent hover:underline"
                >
                  Celý článek »
                </Link>
              </article>
            ))}
          </div>

          {data.pages > 1 && (
            <nav className="mt-10 flex justify-center gap-2">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={n === 1 ? "/blog" : `/blog?page=${n}`}
                  className={
                    n === data.page
                      ? "rounded-[var(--radius-sm)] bg-primary px-3 py-1 text-white"
                      : "rounded-[var(--radius-sm)] border border-border px-3 py-1"
                  }
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </Section>
  );
}
