import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ORG } from "@/lib/org";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";
import { HELP_CTA } from "@/lib/site/nav";

export const metadata: Metadata = {
  title: "Kontakt – SOS výživné nadační fond",
  description: `Kancelář ${ORG.office}. Telefon ${ORG.phoneDisplay}, e-mail ${ORG.email}. IČO ${ORG.ico}, datová schránka ${ORG.dataBox}.`,
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHead
        title={
          <>
            Jsme tu <Accent>pro vás</Accent>
          </>
        }
        lead="Zavolejte, napište, nebo se zastavte v kanceláři v Kralovicích. Konzultace je zdarma."
      />
      <Container className="grid items-start gap-5 pt-10 lg:grid-cols-2 lg:pt-[72px]">
        <section className="rounded-3xl bg-white p-7 md:p-10">
          <h2 className="text-[28px] font-semibold tracking-[-.02em] text-plum">Kontakt</h2>
          <div className="mt-5 grid gap-5 text-wine">
            <div>
              <a href={`tel:${ORG.phone}`} className="text-3xl font-semibold text-plum tabular-nums hover:underline">
                {ORG.phoneDisplay}
              </a>
              <p className="text-sm text-wine-muted">Volání i poradenství jsou zdarma.</p>
            </div>
            <div>
              <a href={`mailto:${ORG.email}`} className="text-xl font-semibold text-plum hover:underline">
                {ORG.email}
              </a>
              <p className="text-sm text-wine-muted">Odpovídáme zpravidla do 24 hodin.</p>
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
              {ORG.hours.map((h) => (
                <div key={h.day} className="contents">
                  <dt className="font-semibold text-plum">{h.day}</dt>
                  <dd className="m-0 tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
            <p>
              Kontaktní osoba: <b className="text-plum">{ORG.contactPerson}</b>
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={HELP_CTA.href}>Chci pomoc s výživným</Button>
            </div>
          </div>
        </section>
        <section className="rounded-3xl bg-sand p-7 md:p-10">
          <h2 className="text-[28px] font-semibold tracking-[-.02em] text-plum">Údaje o fondu</h2>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-wine">
            <dt className="text-wine-muted">Název</dt>
            <dd className="m-0 font-semibold text-plum">{ORG.legalName}</dd>
            <dt className="text-wine-muted">IČO</dt>
            <dd className="m-0 tabular-nums">{ORG.ico}</dd>
            <dt className="text-wine-muted">Datová schránka</dt>
            <dd className="m-0">{ORG.dataBox}</dd>
            <dt className="text-wine-muted">Sídlo</dt>
            <dd className="m-0">{ORG.seat}</dd>
            <dt className="text-wine-muted">Kancelář</dt>
            <dd className="m-0">{ORG.office}</dd>
            <dt className="text-wine-muted">Účet</dt>
            <dd className="m-0 tabular-nums">{ORG.donationAccount}</dd>
          </dl>
          <p className="mt-6 text-wine-muted">Chcete nás podpořit? Pomoc poskytujeme zdarma díky dárcům.</p>
          <div className="mt-3">
            <Button href="/podporte-nas" variant="glass">
              Podpořte nás
            </Button>
          </div>
        </section>
        <div className="overflow-hidden rounded-3xl bg-white lg:col-span-2">
          <OfficeMap query={ORG.office} label="Kancelář Kralovice" />
        </div>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
