import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { searchContent, type SearchResult } from "@/lib/cms/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hledání – SOS výživné",
  description: "Prohledejte články a často kladené dotazy na webu SOS výživné.",
  robots: { index: false },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const query = (q ?? "").trim();

  let results: SearchResult[] = [];
  if (query.length >= 2) {
    try {
      results = await searchContent(locale, query);
    } catch {
      // DB not connected — show empty results.
    }
  }

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl sm:text-5xl text-ink leading-tight">
          Hledání
        </h1>

        <form action="/hledat" method="get" className="mt-6 flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Zadejte hledaný výraz…"
            aria-label="Hledaný výraz"
            className="flex-1 rounded-md border border-hairline bg-white px-4 h-11 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary text-white px-5 h-11 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Search size={18} aria-hidden />
            Hledat
          </button>
        </form>

        <div className="mt-10 space-y-6">
          {query.length < 2 ? (
            <p className="text-ink-muted">Zadejte alespoň dva znaky.</p>
          ) : results.length === 0 ? (
            <p className="text-ink-muted">
              Pro výraz „{query}“ jsme nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            results.map((r) => (
              <article key={r.id} className="border-b border-hairline pb-6">
                <span className="text-xs font-semibold uppercase text-terracotta">
                  {r.type === "FAQ" ? "Dotaz" : "Článek"}
                </span>
                <h2 className="font-heading text-xl text-ink mt-1">
                  <Link
                    href={r.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {r.title}
                  </Link>
                </h2>
                {r.excerpt && (
                  <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 mt-2">
                    {r.excerpt}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </Section>
  );
}
