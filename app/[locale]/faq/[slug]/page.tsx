import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RichText } from "@/components/cms/RichText";
import { getFaqBySlug } from "@/lib/cms/faq";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { SideCta } from "@/components/site/ServiceArticle";

export const revalidate = 3600;

// Pages build on first request and are cached; the build never needs the DB.
export async function generateStaticParams() {
  return [];
}

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
    <>
      <PageHead crumbs={[{ href: "/faq", label: "Poradna" }]} title={faq.question} />
      <Container className="grid items-start gap-10 pt-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14 lg:pt-[72px]">
        <article className="min-w-0">
          <RichText html={faq.answer} className="prose-cms mt-0 max-w-[68ch]" />
          <p className="mt-8">
            <Link href="/faq" className="font-semibold text-rose underline underline-offset-4">
              Další otázky v poradně
            </Link>
          </p>
        </article>
        <SideCta />
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
