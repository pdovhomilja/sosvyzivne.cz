import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { getFaqs, type FaqItem } from "@/lib/cms/faq";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Často kladené dotazy – SOS výživné",
  description: "Odpovědi na nejčastější dotazy k vymáhání výživného a exekuci.",
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let faqs: FaqItem[] = [];
  try {
    faqs = await getFaqs(locale);
  } catch {
    // DB not connected — render empty state.
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.replace(/<[^>]+>/g, "") },
    })),
  };

  return (
    <Section>
      {/* Page header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold text-ink md:text-5xl">
          Často kladené dotazy
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted md:text-xl">
          Najděte odpovědi na nejčastější otázky ohledně vymáhání výživného a
          naší bezplatné pomoci.
        </p>
      </div>

      {faqs.length === 0 ? (
        <p className="mt-6 text-ink-muted">
          Zatím zde nejsou žádné dotazy. Přidejte je v administraci (typ obsahu
          FAQ).
        </p>
      ) : (
        <div className="mx-auto max-w-2xl space-y-0">
          {faqs.map((f) => (
            <details key={f.id} className="group border-b border-hairline">
              <summary
                className="flex cursor-pointer list-none items-center justify-between px-2 py-6 text-left
                  transition-colors hover:text-terracotta
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4
                  [&::-webkit-details-marker]:hidden"
              >
                <span className="pr-4 text-xl font-semibold leading-tight text-ink group-open:text-terracotta">
                  {f.question}
                </span>
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-ink-muted transition-transform duration-300 group-open:rotate-180"
                />
              </summary>

              <div className="px-2 pb-6">
                <div
                  className="prose-cms text-lg leading-relaxed text-ink-muted"
                  dangerouslySetInnerHTML={{ __html: f.answer }}
                />
                <Link
                  href={`/faq/${f.slug}`}
                  className="mt-3 inline-block text-sm text-primary hover:underline"
                >
                  Celý článek »
                </Link>
              </div>
            </details>
          ))}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </div>
      )}
    </Section>
  );
}
