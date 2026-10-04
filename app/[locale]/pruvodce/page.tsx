import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ORG } from "@/lib/org";
import { HELP_CTA } from "@/lib/site/nav";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";
import { NoteChip } from "@/components/site/NoteChip";

export const metadata: Metadata = {
  title: "Průvodce návrhem na zvýšení výživného – SOS výživné",
  description:
    "Připravujeme online průvodce, se kterým si sami sestavíte návrh na zvýšení výživného k soudu. Než ho spustíme, projde ho náš advokát.",
};

const STEPS = [
  { t: "Souhlas se zpracováním údajů", d: "Bez něj průvodce nepokračuje. Údaje uchováme jen po dobu nutnou k sestavení návrhu." },
  { t: "Má návrh smysl?", d: "Z data posledního rozhodnutí, věku dítěte a změn průvodce posoudí, jestli je podání rozumné." },
  { t: "Otázky podle vaší situace", d: "Jedno dítě, více dětí, nebo zletilý student: průvodce ukáže jen otázky, které se vás týkají." },
  { t: "Nahrání rozsudku", d: "Jako PDF nebo fotky jednotlivých stran z mobilu. Hlavní údaje z něj předvyplníme." },
  { t: "Náklady na dítě", d: "Projdete jednotlivé oblasti (škola, kroužky, zdraví, doprava) a průvodce vše sečte." },
  { t: "Kontrola a stažení", d: "Uvidíte souhrn, upozornění na chybějící přílohy a návrh připravený k podání soudu." },
];

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHead
        title={
          <>
            Průvodce návrhem na <Accent>zvýšení</Accent> výživného
          </>
        }
        lead="Připravujeme online průvodce, se kterým si krok za krokem sami sestavíte návrh na zvýšení výživného k soudu."
      >
        <div className="mt-5">
          <NoteChip>Připravujeme · než ho spustíme, projde ho náš advokát</NoteChip>
        </div>
      </PageHead>
      <Container className="max-w-[900px] pt-10 lg:pt-[72px]">
        <h2 className="text-[31px] font-semibold tracking-[-.03em] text-plum md:text-[40px]">
          Co bude průvodce <span className="text-rose"><Accent>umět</Accent></span>
        </h2>
        <ol className="mt-6 grid list-none gap-3 p-0">
          {STEPS.map((s, i) => (
            <li key={s.t} className="grid grid-cols-[52px_minmax(0,1fr)] gap-3.5 rounded-[18px] bg-sand px-5 py-[18px]">
              <span className="font-accent text-[44px] italic leading-[.9] text-rose" aria-hidden>
                {i + 1}
              </span>
              <div>
                <b className="block text-lg text-plum">{s.t}</b>
                <span className="text-wine-muted">{s.d}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-plum p-7 text-[#F6E6DA] md:flex-row md:items-center md:justify-between">
          <div>
            <b className="block text-[26px] tracking-[-.02em] text-[#FFF6EC]">Potřebujete pomoc hned?</b>
            <p className="mt-1">S návrhem na zvýšení výživného vám pomůžeme i bez průvodce.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={HELP_CTA.href} variant="cream">
              Chci pomoc
            </Button>
            <Button href={`tel:${ORG.phone}`} variant="outline-cream">
              {ORG.phoneDisplay}
            </Button>
          </div>
        </div>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
