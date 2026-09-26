import { Link } from "@/i18n/navigation";
import { Accent } from "./Accent";

const WILL_DO = [
  "Ověří, jestli má návrh smysl",
  "Přečte údaje z nahraného rozsudku",
  "Sečte měsíční náklady na dítě",
  "Připraví návrh ke stažení",
];

/** Teaser for the průvodce (sub-project 2) — links to a real explanatory page, no dead button. */
export function GuideCard() {
  return (
    <div className="rounded-[30px] bg-[linear-gradient(120deg,#AEBBCC,#F2D3B0,#E5A27F,#B45658)] p-[3px]">
      <div className="grid items-center gap-10 rounded-[27px] bg-cream p-7 md:p-[52px] lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <span className="text-[13px] font-bold uppercase tracking-[.14em] text-rose">Připravujeme</span>
          <h2 className="mt-3 text-[32px] font-semibold leading-[1.02] tracking-[-.03em] text-plum md:text-5xl">
            Průvodce návrhem na <span className="text-rose"><Accent>zvýšení</Accent></span> výživného
          </h2>
          <p className="mt-3.5 max-w-[50ch] text-wine-muted">
            Sami si krok za krokem sestavíte návrh k soudu. Než průvodce spustíme, projde ho náš advokát.
          </p>
          <Link href="/pruvodce" className="mt-5 inline-block font-semibold text-rose underline underline-offset-4">
            Co průvodce bude umět →
          </Link>
        </div>
        <ol className="m-0 grid list-none gap-2.5 p-0">
          {WILL_DO.map((t, i) => (
            <li key={t} className="flex items-center gap-3.5 rounded-[14px] bg-white px-[18px] py-3.5 font-medium text-wine">
              <span className="w-[18px] font-accent text-[28px] italic leading-none text-rose" aria-hidden>
                {i + 1}
              </span>
              {t}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
