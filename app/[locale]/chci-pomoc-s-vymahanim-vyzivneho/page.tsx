import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Phone, Clock, Mail } from "lucide-react";
import { Section } from "@/components/ui/container";
import { ContactForm } from "./ContactForm";
import { ORG } from "@/lib/org";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";

export const metadata: Metadata = {
  title: "Chci pomoc s vymáháním výživného – SOS výživné",
  description:
    "Napište nám a my vám pomůžeme vymoci výživné, na které máte právo. Služba je zcela zdarma.",
};

export default async function GetHelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const images = pageImages("lead-form");
  const heroImg = images[0];

  return (
    <Section>
      <div className="grid grid-cols-1 gap-12 items-start lg:grid-cols-12">
        {/* Left Column: Form */}
        <section className="lg:col-span-7">
          <h1 className="font-heading text-4xl md:text-5xl text-ink mb-6 leading-tight">
            Chci pomoc s vymáháním výživného
          </h1>
          <p className="text-ink-muted text-lg mb-10 leading-relaxed max-w-2xl">
            Jsme tu pro vás. Pomůžeme vám projít celým procesem krok za krokem, diskrétně a
            zdarma. Stačí vyplnit krátký formulář a naši odborníci se vám ozvou.
          </p>
          <ContactForm />
        </section>

        {/* Right Column: Contact Info Panel */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-peach-light rounded-[var(--radius-xl)] p-8 md:p-10 border border-hairline relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="font-heading text-2xl text-terracotta mb-8">
                Kontaktujte nás přímo
              </h2>
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex gap-4">
                  <Phone
                    className="text-terracotta shrink-0 mt-1"
                    size={24}
                    aria-hidden="true"
                  />
                  <div>
                    <a
                      href={`tel:${ORG.phone}`}
                      className="text-3xl font-bold text-ink mb-1 hover:text-terracotta transition-colors block"
                    >
                      {ORG.phoneDisplay}
                    </a>
                    <p className="text-ink-muted text-sm">Volání i poradenství jsou zdarma.</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <Clock
                    className="text-terracotta shrink-0 mt-1"
                    size={24}
                    aria-hidden="true"
                  />
                  <div>
                    {ORG.hours.map((h) => (
                      <div key={h.day} className="flex justify-between w-48 mb-1">
                        <span className="font-bold text-ink">{h.day}:</span>
                        <span className="text-ink-muted">{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <Mail
                    className="text-terracotta shrink-0 mt-1"
                    size={24}
                    aria-hidden="true"
                  />
                  <div>
                    <a
                      href={`mailto:${ORG.email}`}
                      className="text-xl font-bold text-ink hover:text-terracotta transition-colors block"
                    >
                      {ORG.email}
                    </a>
                    <p className="text-ink-muted text-sm">Odpovídáme zpravidla do 24 hodin.</p>
                  </div>
                </div>
              </div>

              {/* Image */}
              {heroImg && (
                <div className="mt-12 pt-8 border-t border-white/40">
                  <Image
                    src={imgSrc(heroImg)}
                    alt={altText(heroImg)}
                    width={600}
                    height={192}
                    className="w-full h-48 object-cover rounded-[var(--radius-md)] shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
