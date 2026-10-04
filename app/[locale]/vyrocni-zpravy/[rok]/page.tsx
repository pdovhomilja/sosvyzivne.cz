import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { REPORTS, getReport } from "@/lib/content/annual-reports";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";

export const dynamicParams = false;

export function generateStaticParams() {
  return REPORTS.map((r) => ({ rok: String(r.year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ rok: string }> }): Promise<Metadata> {
  const r = getReport(Number((await params).rok));
  return r
    ? { title: `Výroční zpráva ${r.year} – SOS výživné`, description: `Činnost, dary a hospodaření SOS výživné nadačního fondu v roce ${r.year}.` }
    : {};
}

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 mt-12 text-[28px] font-semibold tracking-[-.02em] text-plum md:text-[34px]">{children}</h2>
);

export default async function ReportPage({ params }: { params: Promise<{ locale: string; rok: string }> }) {
  const { locale, rok } = await params;
  setRequestLocale(locale);
  const r = getReport(Number(rok));
  if (!r) notFound();
  return (
    <>
      <PageHead
        crumbs={[{ href: "/vyrocni-zpravy", label: "Výroční zprávy" }]}
        title={
          <>
            Výroční zpráva <Accent>{r.year}</Accent>
          </>
        }
        lead="HTML verze výroční zprávy. Úplné znění včetně účetních výkazů najdete v PDF."
      >
        <div className="mt-6">
          <Button href={r.pdf} variant="glass">
            Stáhnout PDF
          </Button>
        </div>
      </PageHead>
      <Container className="max-w-[860px] pt-4 text-[17px] text-wine">
        <H2>{r.introTitle}</H2>
        <div className="grid gap-4">
          {r.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="text-wine-muted">{r.signedBy}</p>
        </div>

        <H2>Co jsme udělali</H2>
        <ul className="grid list-disc gap-2 pl-5">
          {r.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <H2>Přijaté dary a podpora</H2>
        <ul className="grid gap-2">
          {r.donationsReceived.map((d, i) => (
            <li key={i} className="rounded-2xl bg-white px-5 py-3.5">
              <b className="text-plum">{d.donor}</b>
              {d.amount ? <span className="tabular-nums"> · {d.amount}</span> : null}
              {d.note ? <span className="text-wine-muted"> · {d.note}</span> : null}
            </li>
          ))}
        </ul>

        {r.donationsGiven.length > 0 && (
          <>
            <H2>Poskytnuté dary</H2>
            <ul className="grid list-disc gap-2 pl-5">
              {r.donationsGiven.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </>
        )}

        <H2>Statistiky a partneři</H2>
        <ul className="grid list-disc gap-2 pl-5">
          {r.statistics.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <H2>Hospodaření</H2>
        <div className="overflow-x-auto" data-overflow-ok>
          <table className="w-full border-collapse overflow-hidden rounded-2xl bg-white tabular-nums">
            <tbody>
              {r.finance.map((f) => (
                <tr key={f.label} className="border-b border-[#EFE3D6] last:border-0">
                  <th scope="row" className="px-5 py-3 text-left font-medium text-wine">
                    {f.label}
                  </th>
                  <td className="px-5 py-3 text-right font-semibold text-plum">{f.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-wine-muted">Údaje z rozvahy a výkazu zisku a ztráty k 31. 12. {r.year}.</p>

        <H2>Revizní zpráva</H2>
        <p className="rounded-3xl bg-sand p-6">{r.audit}</p>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
