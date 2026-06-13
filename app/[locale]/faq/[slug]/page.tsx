import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { RichText } from "@/components/cms/RichText";
import { getFaqBySlug } from "@/lib/cms/faq";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const faq = await getFaqBySlug(locale, slug).catch(() => null);
  if (!faq) return { title: "Dotaz nenalezen – SOS výživné" };
  return { title: `${faq.question} – SOS výživné` };
}

export default async function FaqAnswerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const faq = await getFaqBySlug(locale, slug).catch(() => null);
  if (!faq) notFound();

  return (
    <Section>
      <article className="mx-auto max-w-2xl">
        <nav className="text-sm text-ink-muted">
          <Link href="/faq" className="hover:underline">
            Často kladené dotazy
          </Link>{" "}
          ›
        </nav>
        <h1 className="mt-2 text-3xl">{faq.question}</h1>
        <RichText html={faq.answer} className="mt-6" />
      </article>
    </Section>
  );
}
