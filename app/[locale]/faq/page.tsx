import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
      <h1 className="text-3xl sm:text-4xl">Často kladené dotazy</h1>

      {faqs.length === 0 ? (
        <p className="mt-6 text-ink-muted">
          Zatím zde nejsou žádné dotazy. Přidejte je v administraci (typ obsahu
          FAQ).
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.id}
              className="rounded-[var(--radius-md)] border border-border bg-surface p-4"
            >
              <summary className="cursor-pointer font-semibold text-accent">
                {f.question}
              </summary>
              <div
                className="prose-cms mt-3"
                dangerouslySetInnerHTML={{ __html: f.answer }}
              />
              <Link
                href={`/faq/${f.slug}`}
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                Celý článek »
              </Link>
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
