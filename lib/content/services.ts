import type { ImageKey } from "@/lib/site/images";

export type Service = {
  slug: string;
  title: string;
  card: string;
  lead: string;
  when: string[];
  need: string[];
  flow: { title: string; text: string }[];
  price: { title: string; text: string };
  faq: { q: string; a: string }[];
  related?: { href: string; label: string };
  /** Claims Lenka still has to confirm; rendered as a <Verify> marker until empty. */
  verify: string[];
  image: ImageKey;
};

export const SERVICES: Service[] = [
  {
    slug: "vymahani-vyzivneho",
    title: "Vymáhání neplaceného výživného",
    image: "heroPaperwork",
    card: "Druhý rodič neplatí stanovené výživné. Zastoupíme vás a vymáhání vyřídíme za vás.",
    lead: "Když druhý rodič neplatí, máte nárok výživné vymáhat, i zpětně. Provedeme vás celým postupem a zastoupíme vás, abyste na to nebyli sami.",
    when: [
      "Máte pravomocný rozsudek o výživném nebo soudem schválenou dohodu.",
      "Druhý rodič neplatí vůbec, platí pozdě nebo jen část.",
      "Dluh na výživném vznikl i před delší dobou.",
    ],
    need: ["Kopii rozsudku. Stačí fotka.", "Podepsanou plnou moc. Pošleme vám ji.", "Přehled plateb, které přišly a které chybí."],
    flow: [
      { title: "Konzultace", text: "Probereme váš případ po telefonu nebo e-mailem." },
      { title: "Návrh na exekuci", text: "Připravíme ho a podáme za vás." },
      { title: "Komunikace s exekutorem", text: "Sledujeme řízení a jednáme za vás." },
      { title: "Platby jdou vám", text: "Vymožené výživné dostáváte přímo." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      { q: "Musím chodit k soudu nebo na úřady?", a: "Ne. Na základě plné moci jednáme za vás." },
      { q: "Co když druhý rodič žije v zahraničí?", a: "I tehdy se dá výživné vymáhat, postup je ale jiný. Zavolejte nám a probereme to." },
      { q: "Nemám rozsudek po ruce. Co teď?", a: "Pomůžeme vám ho vyžádat od soudu, který rozhodoval." },
    ],
    verify: ["i zpětně (promlčení)", "kdo nese náklady exekuce", "platby jdou přímo klientovi", "zahraničí"],
  },
  {
    slug: "nahradni-vyzivne",
    title: "Náhradní výživné",
    image: "topicMomHug",
    card: "Když druhý rodič neplatí, může v některých případech pomoci stát. Zjistíme, jestli máte nárok.",
    lead: "Náhradní výživné vyplácí stát, když povinný rodič neplatí. Pomůžeme vám zjistit, jestli na něj máte nárok, a s žádostí na úřadu práce.",
    when: [
      "Druhý rodič neplatí výživné stanovené soudem.",
      "Vymáhání už běží nebo jste ho zahájili.",
      "Pečujete o nezaopatřené dítě.",
    ],
    need: ["Rozsudek o výživném.", "Doklad o zahájeném vymáhání (exekuce).", "Údaje o dítěti a o tom, co druhý rodič zaplatil."],
    flow: [
      { title: "Ověříme nárok", text: "Projdeme s vámi podmínky náhradního výživného." },
      { title: "Připravíme žádost", text: "Pomůžeme vyplnit žádost pro úřad práce a doložit přílohy." },
      { title: "Pohlídáme vymáhání", text: "Náhradní výživné nenahrazuje vymáhání, souběžně ho vedeme dál." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      { q: "Kdo náhradní výživné vyplácí?", a: "Úřad práce České republiky." },
      { q: "Musím kvůli tomu přestat vymáhat?", a: "Ne. Vymáhání dlužného výživného pokračuje dál." },
    ],
    related: { href: "/blog/nahradni-vyzivne-pomoc-proti-neplaticum", label: "Náhradní výživné: pomoc proti neplatičům" },
    verify: ["rozsah pomoci SOS výživné s náhradním výživným", "podmínky nároku"],
  },
  {
    slug: "zvyseni-vyzivneho",
    title: "Zvýšení výživného",
    image: "heroMomSonKitchen",
    card: "Dítě vyrostlo, náklady stouply. Posoudíme, jestli má smysl žádat o zvýšení.",
    lead: "Když se od posledního rozhodnutí změnily poměry, například dítě nastoupilo do školy nebo druhý rodič vydělává víc, můžete soud požádat o zvýšení výživného.",
    when: [
      "Od posledního rozhodnutí se podstatně změnily poměry.",
      "Od rozsudku uplynula delší doba, z praxe doporučujeme alespoň dva roky.",
      "Náklady na dítě jsou vyšší, než s čím soud počítal.",
    ],
    need: ["Poslední rozsudek o výživném.", "Přehled současných nákladů na dítě.", "Doklady ke změnám (škola, zdravotní potřeby, kroužky)."],
    flow: [
      { title: "Posouzení", text: "Řekneme vám, jestli má návrh smysl podávat." },
      { title: "Podklady", text: "Pomůžeme sepsat náklady a změny od posledního rozhodnutí." },
      { title: "Návrh k soudu", text: "Připravíme návrh na zvýšení výživného." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      {
        q: "Jak dlouho po rozsudku mohu žádat?",
        a: "Rozhoduje změna poměrů. Z praxe doporučujeme, aby od posledního rozhodnutí uplynuly alespoň dva roky.",
      },
      {
        q: "Připravujete i online průvodce?",
        a: "Ano. Průvodce návrhem na zvýšení výživného připravujeme. Než ho spustíme, projde ho náš advokát.",
      },
    ],
    related: { href: "/pruvodce", label: "Průvodce návrhem k soudu" },
    verify: ["SOS výživné připravuje návrhy na zvýšení"],
  },
  {
    slug: "zletili-studenti",
    title: "Výživné pro zletilé studenty",
    image: "topicStudent",
    card: "Studujete a rodič přestal platit? Vyživovací povinnost trvá, dokud se nemůžete sami živit.",
    lead: "Vyživovací povinnost rodičů nekončí osmnáctými narozeninami. Pokud studujete a rodič přestal platit, pomůžeme vám výživné vymoci.",
    when: [
      "Je vám 18 a víc a soustavně se připravujete na povolání.",
      "Rodič neplatí výživné stanovené soudem.",
      "Nebo výživné dosud stanovené nemáte a potřebujete ho.",
    ],
    need: ["Rozsudek o výživném, pokud existuje.", "Potvrzení o studiu.", "Přehled plateb."],
    flow: [
      { title: "Konzultace", text: "Probereme vaši situaci, jednáte sami za sebe." },
      { title: "Vymáhání nebo návrh", text: "Podle situace vymáháme dlužné výživné, nebo připravíme návrh k soudu." },
      { title: "Zastoupení", text: "Na základě plné moci jednáme za vás." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      {
        q: "Musí za mě jednat rodič, u kterého bydlím?",
        a: "Ne. Jako zletilý jednáte sami za sebe a plnou moc podepisujete vy.",
      },
    ],
    verify: ["postup, když výživné dosud stanovené není"],
  },
  {
    slug: "mediace",
    title: "Mediace",
    image: "topicPaperwork",
    card: "Dohoda místo sporu. Akreditovaná mediátorka pomůže rodičům domluvit se.",
    lead: "Mediace je mimosoudní cesta, jak se rodiče dohodnou na výživném a péči o dítě. Vede ji akreditovaná mediátorka PhDr. Lenka Ranšová.",
    when: [
      "Chcete se s druhým rodičem dohodnout bez soudu.",
      "Oba rodiče jsou ochotni jednat.",
      "Potřebujete upravit výši výživného nebo péči.",
    ],
    need: ["Ochotu obou rodičů přijít na setkání.", "Základní přehled o nákladech na dítě."],
    flow: [
      { title: "Úvodní rozhovor", text: "Vysvětlíme, jak mediace probíhá." },
      { title: "Společná setkání", text: "Mediátorka vede rozhovor tak, aby oba rodiče byli slyšet." },
      { title: "Dohoda", text: "Výsledkem je písemná dohoda, kterou lze předložit soudu." },
    ],
    price: { title: "Kolik to stojí?", text: "Cenu mediace vám řekneme při úvodním rozhovoru." },
    faq: [{ q: "Je mediace povinná?", a: "Ne, je dobrovolná. Oba rodiče se jí účastní z vlastní vůle." }],
    verify: ["cena mediace", "dohodu lze předložit soudu"],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
