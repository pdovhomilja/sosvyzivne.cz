import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
    <main className="min-h-screen pb-24">
      {/* Hero / Intro */}
      <section className="max-w-[800px] mx-auto px-6 text-center mb-12 pt-12">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-terracotta mb-6">
          Kalkulačka výživného
        </h1>
        <p className="text-lg md:text-xl text-ink-muted leading-relaxed">
          Tato kalkulačka vám pomůže odhadnout doporučenou výši výživného
          (alimentů) na základě příjmu rodiče a věku dětí. Výpočet vychází z
          doporučujících tabulek Ministerstva spravedlnosti ČR. Výsledná částka
          není právně závazná a slouží pouze pro orientaci.
        </p>
      </section>

      {/* Calculator Form */}
      <section className="max-w-[700px] mx-auto px-6">
        <div className="bg-surface rounded-xl border border-hairline p-8 md:p-12 shadow-sm">
          <Calculator />
        </div>
      </section>

      {/* Proč je důležité znát své nároky? */}
      <section className="max-w-[700px] mx-auto px-6 mt-16">
        <h2 className="font-heading text-2xl text-terracotta mb-6">
          Proč je důležité znát své nároky?
        </h2>
        <div className="space-y-4 text-ink-muted leading-relaxed">
          <p>
            Výživné je zákonná povinnost rodiče přispívat na potřeby svého
            dítěte. Znalost orientační výše vám pomůže lépe vyjednat dohodu
            nebo se připravit na soudní řízení.
          </p>
          <p>
            Tabulky Ministerstva spravedlnosti ČR slouží jako doporučené
            vodítko pro soudy i rodiče. Skutečnou výši výživného vždy určuje
            soud na základě konkrétní situace obou rodičů a potřeb dítěte.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-[700px] mx-auto px-6 mt-8">
        <div className="rounded-xl bg-surface-subtle border border-hairline p-6 text-sm text-ink-muted">
          <strong className="text-ink">Upozornění:</strong> Skutečnou výši
          výživného určuje soud a zohledňuje i další okolnosti (např. majetkové
          poměry, potřeby dítěte, typ péče apod.).
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[700px] mx-auto px-6 mt-8 text-center">
        <Button asChild size="lg">
          <Link href="/chci-pomoc-s-vymahanim-vyzivneho">
            Chci pomoc s vymáháním výživného
          </Link>
        </Button>
      </section>
    </main>
  );
}
