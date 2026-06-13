import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calculator } from "./Calculator";

export const metadata: Metadata = {
  title: "Kalkulačka výživného – SOS výživné",
  description:
    "Odhadněte doporučenou výši výživného na základě příjmu rodiče a věku dětí. Vychází z doporučujících tabulek Ministerstva spravedlnosti ČR.",
};

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">Kalkulačka výživného</h1>
        <p className="mt-3 text-ink-muted">
          Tato kalkulačka vám pomůže odhadnout doporučenou výši výživného
          (alimentů) na základě příjmu rodiče a věku dětí. Výpočet vychází z
          doporučujících tabulek Ministerstva spravedlnosti ČR. Výsledná částka
          není právně závazná a slouží pouze pro orientaci.
        </p>

        <div className="mt-8">
          <Calculator />
        </div>

        <p className="mt-8 rounded-[var(--radius-sm)] bg-surface-muted p-4 text-sm text-ink-muted">
          <strong>Upozornění:</strong> Skutečnou výši výživného určuje soud a
          zohledňuje i další okolnosti (např. majetkové poměry, potřeby dítěte,
          typ péče apod.).
        </p>

        <div className="mt-6">
          <Button asChild>
            <Link href="/chci-pomoc-s-vymahanim-vyzivneho">
              Chci pomoc s vymáháním výživného
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
