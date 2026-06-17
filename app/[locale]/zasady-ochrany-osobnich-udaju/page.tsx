import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/container";
import { ORG } from "@/lib/org";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů – SOS výživné",
  description:
    "Jak SOS výživné nadační fond zpracovává osobní údaje, používá cookies a analytiku v souladu s GDPR.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <div className="mx-auto max-w-3xl space-y-6 text-ink-muted leading-relaxed">
        <h1 className="font-heading text-4xl sm:text-5xl text-ink leading-tight">
          Zásady ochrany osobních údajů
        </h1>

        <p>
          Správcem osobních údajů je <strong className="text-ink">{ORG.legalName}</strong>,
          IČO: {ORG.ico}, se sídlem {ORG.seat}. V otázkách ochrany osobních údajů
          nás můžete kontaktovat na e-mailu{" "}
          <a href={`mailto:${ORG.email}`} className="text-terracotta hover:underline">
            {ORG.email}
          </a>.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Jaké údaje zpracováváme</h2>
        <p>
          Zpracováváme údaje, které nám sami poskytnete prostřednictvím
          kontaktního formuláře nebo e-mailem (zejména jméno, e-mail, telefon
          a popis vaší situace), a to výhradně za účelem poskytnutí poradenství
          a pomoci s vymáháním výživného. Právním základem je váš souhlas,
          případně plnění opatření přijatých před uzavřením smlouvy.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Cookies</h2>
        <p>
          Náš web používá nezbytné cookies nutné pro jeho fungování. S vaším
          souhlasem používáme také analytické cookies. Své předvolby můžete
          kdykoli změnit přes odkaz „Nastavení cookies“ v patičce webu.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Analytika (PostHog)</h2>
        <p>
          Pro zlepšování webu používáme nástroj PostHog. Analytické sledování se
          aktivuje až poté, co v liště cookies povolíte kategorii „Analytika“.
          Bez vašeho souhlasu se žádné analytické údaje neshromažďují.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Vaše práva</h2>
        <p>
          Máte právo na přístup ke svým údajům, jejich opravu nebo výmaz,
          omezení zpracování, vznesení námitky a odvolání souhlasu. Pro
          uplatnění práv nás kontaktujte na{" "}
          <a href={`mailto:${ORG.email}`} className="text-terracotta hover:underline">
            {ORG.email}
          </a>. Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních
          údajů (www.uoou.cz).
        </p>
      </div>
    </Section>
  );
}
