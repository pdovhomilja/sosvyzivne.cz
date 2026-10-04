import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { searchContent, type SearchResult } from "@/lib/cms/search";
import { PageHead } from "@/components/site/PageHead";
import { Accent } from "@/components/site/Accent";

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
    } catch (err) {
      console.error("[search] failed to query content:", err);
    }
  }

  return (
    <>
    <PageHead title={<>Hledat na <Accent>webu</Accent></>} />
    <Section>
      <div className="mx-auto max-w-3xl">

        <form action="/hledat" method="get" className="mt-6 flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Zadejte hledaný výraz…"
            aria-label="Hledaný výraz"
            className="min-w-0 flex-1 rounded-full border border-[#E6D6C6] bg-white px-5 h-12 text-wine focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-plum text-white px-5 h-12 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2"
          >
            <Search size={18} aria-hidden />
            Hledat
          </button>
        </form>

        <div className="mt-10 space-y-6">
          {query.length < 2 ? (
            <p className="text-wine-muted">Zadejte alespoň dva znaky.</p>
          ) : results.length === 0 ? (
            <p className="text-wine-muted">
              Pro výraz „{query}“ jsme nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            results.map((r) => (
              <article key={r.id} className="border-b border-[#E6D6C6] pb-6">
                <span className="text-xs font-semibold uppercase text-rose">
                  {r.type === "FAQ" ? "Dotaz" : "Článek"}
                </span>
                <h2 className="font-sans text-xl text-wine mt-1">
                  <Link
                    href={r.href}
                    className="hover:text-plum transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum rounded"
                  >
                    {r.title}
                  </Link>
                </h2>
                {r.excerpt && (
                  <p className="text-sm text-wine-muted leading-relaxed line-clamp-2 mt-2">
                    {r.excerpt}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </Section>
    </>
  );
}
