import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/container";
import { ContactForm } from "./ContactForm";
import { ORG } from "@/lib/org";

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

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-3xl sm:text-4xl">Chci pomoc s vymáháním výživného</h1>
          <p className="mt-3 text-ink-muted">{ORG.tagline}</p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
        <aside className="h-fit rounded-[var(--radius-md)] bg-surface-muted p-6 text-sm">
          <p className="text-lg font-semibold text-accent">{ORG.phoneDisplay}</p>
          {ORG.hours.map((h) => (
            <p key={h.day}>
              {h.day} {h.time}
            </p>
          ))}
          <p className="mt-4">
            <strong>E-mail:</strong>{" "}
            <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
          </p>
        </aside>
      </div>
    </Section>
  );
}
