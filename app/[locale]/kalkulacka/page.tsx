import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Calculator } from "./Calculator";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";

export const metadata: Metadata = {
  title: "Kalkulačka výživného – SOS výživné",
  description:
    "Odhadněte doporučenou výši výživného na základě příjmu rodiče a věku dětí. Vychází z doporučujících tabulek Ministerstva spravedlnosti ČR.",
};

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHead
        title={
          <>
            Kalkulačka <Accent>výživného</Accent>
          </>
        }
        lead="Odhadněte doporučenou výši výživného (alimentů) podle příjmu rodiče a věku dětí. Výpočet vychází z doporučujících tabulek Ministerstva spravedlnosti ČR. Výsledná částka není právně závazná a slouží pouze pro orientaci."
      />
      <Container className="max-w-[760px] pt-10 lg:pt-[72px]">
        <div className="rounded-3xl bg-white p-6 md:p-12">
          <Calculator />
        </div>

        <h2 className="mt-14 text-[28px] font-semibold tracking-[-.02em] text-plum">Proč je důležité znát své nároky?</h2>
        <div className="mt-4 grid gap-4 text-wine">
          <p>
            Výživné je zákonná povinnost rodiče přispívat na potřeby svého dítěte. Znalost orientační výše vám pomůže
            lépe vyjednat dohodu nebo se připravit na soudní řízení.
          </p>
          <p>
            Tabulky Ministerstva spravedlnosti ČR slouží jako doporučené vodítko pro soudy i rodiče. Skutečnou výši
            výživného vždy určuje soud na základě konkrétní situace obou rodičů a potřeb dítěte.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-sand p-6 text-sm text-wine-muted">
          <strong className="text-plum">Upozornění:</strong> Skutečnou výši výživného určuje soud a zohledňuje i další
          okolnosti (např. majetkové poměry, potřeby dítěte, typ péče apod.).
        </div>

        <div className="mt-8 flex justify-center">
          <Button href="/chci-pomoc-s-vymahanim-vyzivneho">Chci pomoc s vymáháním výživného</Button>
        </div>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
