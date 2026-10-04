import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { getFaqs, type FaqItem } from "@/lib/cms/faq";
import { PageHead } from "@/components/site/PageHead";
import { Accent } from "@/components/site/Accent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Poradna: časté otázky – SOS výživné",
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
  } catch (err) {
    console.error("[faq] failed to load FAQs:", err);
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
    <>
    <PageHead title={<>Poradna: <Accent>časté otázky</Accent></>} lead="Odpovědi na nejčastější otázky k vymáhání výživného, exekuci a naší bezplatné pomoci." />
    <Section>
      {faqs.length === 0 ? (
        <p className="mt-6 text-wine-muted">
          Odpovědi připravujeme. Zatím nám prosím zavolejte nebo napište.
        </p>
      ) : (
        <div className="mx-auto max-w-3xl rounded-3xl bg-white px-4 py-2 md:px-8">
          {faqs.map((f) => (
            <details key={f.id} className="group border-b border-[#E6D6C6]">
              <summary
                className="flex cursor-pointer list-none items-center justify-between px-2 py-6 text-left
                  transition-colors hover:text-rose
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-4
                  [&::-webkit-details-marker]:hidden"
              >
                <span className="pr-4 text-xl font-semibold leading-tight text-wine group-open:text-rose">
                  {f.question}
                </span>
                <ChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-wine-muted transition-transform duration-300 group-open:rotate-180"
                />
              </summary>

              <div className="px-2 pb-6">
                <div
                  className="prose-cms text-lg leading-relaxed text-wine-muted"
                  dangerouslySetInnerHTML={{ __html: f.answer }}
                />
                <Link
                  href={`/faq/${f.slug}`}
                  className="mt-3 inline-block text-sm text-plum hover:underline"
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
    </>
  );
}
