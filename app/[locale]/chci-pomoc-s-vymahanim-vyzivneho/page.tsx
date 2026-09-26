import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ContactForm } from "./ContactForm";
import { ORG } from "@/lib/org";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";

export const metadata: Metadata = {
  title: "Chci pomoc s vymáháním výživného – SOS výživné",
  description:
    "Napište nám a my vám pomůžeme vymoci výživné, na které máte právo. Služba je zcela zdarma.",
};

export default async function GetHelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHead
        title={
          <>
            Chci pomoc s <Accent>výživným</Accent>
          </>
        }
        lead="Jsme tu pro vás. Pomůžeme vám projít celým procesem krok za krokem, diskrétně a zdarma. Stačí vyplnit krátký formulář a ozveme se vám."
      />
      <Container className="grid items-start gap-8 pt-10 lg:grid-cols-[1.4fr_1fr] lg:pt-[72px]">
        <section className="rounded-3xl bg-white p-6 md:p-10">
          <ContactForm />
        </section>
        <aside className="flex flex-col gap-6 rounded-3xl bg-plum p-7 text-[#F6E6DA] lg:sticky lg:top-6">
          <h2 className="text-[26px] font-semibold tracking-[-.02em] text-[#FFF6EC]">
            Raději <span className="text-honey"><Accent>zavoláte?</Accent></span>
          </h2>
          <div>
            <a href={`tel:${ORG.phone}`} className="block text-3xl font-semibold text-[#FFF6EC] tabular-nums hover:underline">
              {ORG.phoneDisplay}
            </a>
            <p className="text-sm text-[#D9BFB3]">Volání i poradenství jsou zdarma.</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            {ORG.hours.map((h) => (
              <div key={h.day} className="contents">
                <dt className="font-semibold text-[#FFF6EC]">{h.day}</dt>
                <dd className="m-0 tabular-nums">{h.time}</dd>
              </div>
            ))}
          </dl>
          <div>
            <a href={`mailto:${ORG.email}`} className="text-lg font-semibold text-[#FFF6EC] hover:underline">
              {ORG.email}
            </a>
            <p className="text-sm text-[#D9BFB3]">Odpovídáme zpravidla do 24 hodin.</p>
          </div>
          <p className="border-t border-white/15 pt-4 text-[13px] text-[#BFA296]">
            {ORG.legalName} · IČO {ORG.ico} · nezisková organizace
          </p>
        </aside>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
