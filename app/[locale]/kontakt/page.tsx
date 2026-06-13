import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/container";
import { ORG } from "@/lib/org";

export const metadata: Metadata = {
  title: "Podpořte naši činnost – SOS výživné",
  description:
    "Pomozte nám podporovat rodiče samoživitele a jejich děti. Finanční dar, sdílení nebo doporučení – pomoci může každý.",
};

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">Podpořte naši činnost</h1>
        <div className="prose-cms mt-6">
          <p>
            Naše práce má smysl díky lidem, kterým není lhostejný osud rodičů
            samoživitelů a jejich dětí. Pomoci může opravdu každý – sdílením
            našich aktivit, doporučením dál nebo finanční podporou našich
            programů.
          </p>
          <p>
            Pokud se rozhodnete přispět finančně, můžete využít{" "}
            <strong>bankovní převod</strong> na účet:{" "}
            <strong>{ORG.donationAccount}</strong>.
          </p>
          <p>
            Rádi vám vystavíme potvrzení o daru, které můžete uplatnit pro
            daňové účely. V případě firemní podpory připravujeme darovací
            smlouvy podle individuální domluvy.
          </p>
          <p>Ze srdce děkujeme za vaši podporu, důvěru a solidaritu. 💛</p>
        </div>

        <div className="mt-10 rounded-[var(--radius-md)] bg-surface-muted p-6 text-sm">
          <h2 className="text-xl">Kontakt</h2>
          <p className="mt-3 font-semibold">{ORG.legalName}</p>
          <p>IČO: {ORG.ico}</p>
          <p>Sídlo: {ORG.seat}</p>
          <p>Kancelář: {ORG.office}</p>
          <p>ID datové schránky: {ORG.dataBox}</p>
          <p className="mt-2">
            E-mail: <a href={`mailto:${ORG.email}`}>{ORG.email}</a> · Tel.:{" "}
            <a href={`tel:${ORG.phone}`}>{ORG.phoneDisplay}</a>
          </p>
          <p>Kontaktní osoba: {ORG.contactPerson}</p>
          <p className="mt-2 font-semibold">Pracovní doba:</p>
          {ORG.hours.map((h) => (
            <p key={h.day}>
              {h.day} {h.time}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
