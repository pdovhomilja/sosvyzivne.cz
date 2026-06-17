import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Mail, Phone, Clock } from "lucide-react";
import { Section } from "@/components/ui/container";
import { CopyAccountButton } from "@/components/contact/CopyAccountButton";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { ORG } from "@/lib/org";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";
import { donationQrSvg } from "@/lib/payment-qr";

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

  const qrSvg = await donationQrSvg(ORG.donationAccount, "Dar SOS vyzivne");

  const homeImages = pageImages("home");
  // home-03 = "Rodič samoživitel" – warm parent/child image
  const warmImg = homeImages[2] ?? homeImages[0];

  return (
    <Section>
      <div className="mx-auto max-w-3xl">

        {/* ── H1 ── */}
        <h1 className="font-heading text-4xl sm:text-5xl text-ink leading-tight">
          Podpořte naši činnost
        </h1>

        {/* ── Intro prose ── */}
        <div className="mt-6 space-y-4 text-ink-muted text-lg leading-relaxed">
          <p>
            Naše práce má smysl díky lidem, kterým není lhostejný osud rodičů
            samoživitelů a jejich dětí. Pomoci může opravdu každý – sdílením
            našich aktivit, doporučením dál nebo finanční podporou našich
            programů.
          </p>
          <p>
            Z darů financujeme nejen právní a psychologické poradenství, ale
            také obědy ve škole a školní pomůcky pro děti z rodin, kde jeden
            z rodičů výživné neplatí. Každý příspěvek – jakkoli malý – přímo
            mění životy těchto rodin.
          </p>
          <p>
            Rádi vám vystavíme potvrzení o daru, které můžete uplatnit pro
            daňové účely. V případě firemní podpory připravujeme darovací
            smlouvy podle individuální domluvy. Ze srdce děkujeme za vaši
            podporu, důvěru a solidaritu.
          </p>
        </div>

        {/* ── Donation card ── */}
        <div className="mt-10 rounded-xl bg-peach-light border border-hairline p-8">
          <h2 className="font-heading text-2xl text-terracotta mb-1">
            Bankovní převod
          </h2>
          <p className="text-ink-muted text-sm mb-6">
            Přispějte přímo na transparentní účet nadačního fondu.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Account number – displayed large */}
            <span className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-wide">
              {ORG.donationAccount}
            </span>
            <CopyAccountButton account={ORG.donationAccount} />
          </div>

          {/* QR placeholder */}
          <div className="mt-8 flex flex-col sm:flex-row gap-6 items-start">
            <div
              className="w-40 h-40 shrink-0 rounded-lg bg-white border border-hairline p-2 flex items-center justify-center"
              role="img"
              aria-label="QR kód pro platbu na účet nadačního fondu"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-ink-muted text-sm leading-relaxed self-center">
              Naskenujte QR kód vaší bankovní aplikací pro rychlou platbu.
              Variabilní symbol není povinný. Do zprávy pro příjemce můžete
              uvést své jméno nebo účel daru.
            </p>
          </div>
        </div>

        {/* ── Warm photo ── */}
        {warmImg && (
          <div className="mt-10 overflow-hidden rounded-xl shadow-sm">
            <Image
              src={imgSrc(warmImg)}
              alt={altText(warmImg)}
              width={900}
              height={400}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* ── Contact block ── */}
        <div className="mt-10 rounded-xl bg-surface-subtle border border-hairline p-8">
          <h2 className="font-heading text-2xl text-ink mb-6">Kontakt</h2>

          <div className="space-y-6 text-sm">
            {/* Legal details */}
            <div>
              <p className="font-semibold text-base text-ink">{ORG.legalName}</p>
              <p className="text-ink-muted mt-1">IČO: {ORG.ico}</p>
              <p className="text-ink-muted">Sídlo: {ORG.seat}</p>
              <p className="text-ink-muted">Kancelář: {ORG.office}</p>
              <p className="text-ink-muted">ID datové schránky: {ORG.dataBox}</p>
            </div>

            <div className="border-t border-hairline" />

            {/* Contact person + email + phone */}
            <div className="space-y-4">
              <p className="text-ink-muted">
                Kontaktní osoba:{" "}
                <span className="font-semibold text-ink">{ORG.contactPerson}</span>
              </p>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-terracotta shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${ORG.email}`}
                  className="text-ink hover:text-terracotta transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                >
                  {ORG.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-terracotta shrink-0" aria-hidden="true" />
                <a
                  href={`tel:${ORG.phone}`}
                  className="text-ink hover:text-terracotta transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                >
                  {ORG.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="border-t border-hairline" />

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock size={18} className="text-terracotta shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-ink mb-2">Pracovní doba:</p>
                {ORG.hours.map((h) => (
                  <div key={h.day} className="flex gap-4 mb-1">
                    <span className="w-24 font-medium text-ink">{h.day}:</span>
                    <span className="text-ink-muted">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Map placeholder ── */}
        <div className="mt-6 rounded-xl bg-surface-subtle border border-hairline overflow-hidden">
          <OfficeMap query={ORG.office} label="Kancelář Kralovice" />
        </div>

      </div>
    </Section>
  );
}
