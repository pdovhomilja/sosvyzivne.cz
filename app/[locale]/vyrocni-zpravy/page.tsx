import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { REPORTS } from "@/lib/content/annual-reports";
import { ORG } from "@/lib/org";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";

export const metadata: Metadata = {
  title: "Výroční zprávy – SOS výživné nadační fond",
  description: "Výroční zprávy SOS výživné nadačního fondu 2023–2025: činnost, dary, statistiky, hospodaření a revizní zpráva.",
};

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHead
        title={
          <>
            Průhledně, <Accent>rok za rokem</Accent>
          </>
        }
        lead={`Jako nadační fond (IČO ${ORG.ico}) každý rok zveřejňujeme, co jsme udělali, kdo nás podpořil a jak jsme hospodařili.`}
      />
      <Container className="grid gap-5 pt-10 md:grid-cols-3 lg:pt-[72px]">
        {REPORTS.map((r) => {
          const result = r.finance.find((f) => f.label === "Výsledek hospodaření");
          return (
            <article key={r.year} className="flex flex-col gap-4 rounded-3xl bg-white p-7">
              <span className="font-accent text-6xl italic leading-none text-rose">{r.year}</span>
              <p className="text-wine">{r.highlights[0]}</p>
              {result && (
                <p className="text-sm text-wine-muted">
                  {result.label}: <b className="text-plum tabular-nums">{result.value}</b>
                </p>
              )}
              <div className="mt-auto flex flex-wrap gap-4 pt-2">
                <Link href={`/vyrocni-zpravy/${r.year}`} className="font-semibold text-rose underline underline-offset-4">
                  Číst zprávu
                </Link>
                <a href={r.pdf} className="font-semibold text-wine-muted underline underline-offset-4">
                  PDF
                </a>
              </div>
            </article>
          );
        })}
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
