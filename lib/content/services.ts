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
      { title: "Platby jdou vám", text: "Vymožené peníze vám exekutor posílá přímo na účet." },
    ],
    price: {
      title: "Kolik to stojí? Pro vás nic.",
      text: "Za naše služby nic neplatíte. Náklady exekučního řízení jdou vždy za dlužníkem, nad rámec dluhu.",
    },
    faq: [
      {
        q: "Musím chodit k soudu nebo na úřady?",
        a: "Ne. Za vás jedná vždy zastupující advokát. O každém kroku vás informujeme, a když je potřeba vaše stanovisko nebo nějaký doklad, ozveme se vám.",
      },
      {
        q: "Co když druhý rodič žije v zahraničí?",
        a: "Vymáhat můžeme jen tehdy, když má dlužník pobyt v České republice. Pokud žije v zahraničí, obraťte se na Úřad pro mezinárodněprávní ochranu dětí (ÚMPOD) v Brně.",
      },
      {
        q: "Nemám rozsudek po ruce. Co teď?",
        a: "Na základě plné moci si ho vyžádáme od soudu. Potřebujeme jen vědět, který soud rozsudek vydal.",
      },
    ],
    verify: [],
  },
  {
    slug: "nahradni-vyzivne",
    title: "Náhradní výživné",
    image: "topicMomHug",
    card: "Když druhý rodič neplatí, může v některých případech pomoci stát. Zjistíme, jestli máte nárok.",
    lead: "Náhradní výživné vyplácí stát, když povinný rodič neplatí. Zajistíme exekuční řízení, které je podmínkou nároku, a pomůžeme vám připravit žádost s přílohami. Na úřadu práce ji pak podáte sami.",
    when: [
      "Druhý rodič neplatí výživné stanovené soudem.",
      "Pečujete o nezaopatřené dítě.",
      "Vymáhání už běží nebo jste ho zahájili. Pro náhradní výživné je nutné zahájené exekuční řízení, jeho zahájení za vás zajistíme.",
    ],
    need: ["Rozsudek o výživném.", "Doklad o zahájeném vymáhání (exekuce).", "Údaje o dítěti a o tom, co druhý rodič zaplatil."],
    flow: [
      { title: "Ověříme nárok", text: "Projdeme s vámi podmínky náhradního výživného." },
      { title: "Zajistíme exekuci", text: "Zahájené exekuční řízení je podmínkou, bez které náhradní výživné čerpat nelze." },
      { title: "Pomůžeme s žádostí", text: "Připravíme s vámi žádost a potřebné přílohy. Na úřadu práce ji podáte sami." },
      { title: "Pohlídáme vymáhání", text: "Náhradní výživné nenahrazuje vymáhání, souběžně ho vedeme dál." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      { q: "Kdo náhradní výživné vyplácí?", a: "Úřad práce České republiky." },
      { q: "Musím kvůli tomu přestat vymáhat?", a: "Ne. Vymáhání dlužného výživného pokračuje dál." },
      {
        q: "Kdo má nárok na náhradní výživné?",
        a: "Nezaopatřené dítě s trvalým pobytem v České republice, pokud rodič výživné řádně neplatí a výživné je vymáháno v exekučním řízení. Za nezaopatřené se považuje hlavně dítě do skončení povinné školní docházky. Nárok může pokračovat i potom, pokud se dítě soustavně připravuje na povolání, typicky studiem, a za určitých podmínek až do 26 let. Když dítě studium ukončí a dál se na povolání nepřipravuje, nárok do budoucna zpravidla zaniká. Nejste si jistí? Vaši situaci posoudíme.",
      },
      {
        q: "Jak dlouho se náhradní výživné vyplácí?",
        a: "Výše se stanoví vždy na 4 měsíce a pak se situace znovu posoudí. Celkem je možné náhradní výživné čerpat až 72 měsíců a tato doba nemusí být nepřetržitá. Když druhý rodič začne platit, výplata se ukončí nebo přeruší, a když znovu přestane, lze v čerpání pokračovat. Změní-li soud výši výživného, promítne se to i do náhradního výživného.",
      },
    ],
    related: { href: "/blog/nahradni-vyzivne-pomoc-proti-neplaticum", label: "Náhradní výživné: pomoc proti neplatičům" },
    verify: [],
  },
  {
    slug: "zvyseni-vyzivneho",
    title: "Zvýšení výživného",
    image: "heroMomSonKitchen",
    card: "Dítě vyrostlo, náklady stouply. Poradíme vám, jestli a jak o zvýšení žádat.",
    lead: "Když se od posledního rozhodnutí změnily poměry, například dítě nastoupilo do školy nebo druhý rodič vydělává víc, můžete soud požádat o zvýšení výživného.",
    when: [
      "Od posledního rozhodnutí se podstatně změnily poměry.",
      "Od rozsudku uplynula delší doba, z praxe doporučujeme alespoň dva roky.",
      "Náklady na dítě jsou vyšší, než s čím soud počítal.",
    ],
    need: ["Poslední rozsudek o výživném.", "Přehled současných nákladů na dítě.", "Doklady ke změnám (škola, zdravotní potřeby, kroužky)."],
    flow: [
      { title: "Posouzení", text: "Řekneme vám, jestli má návrh smysl podávat." },
      { title: "Podklady", text: "Poradíme, jaké náklady a změny od posledního rozhodnutí doložit." },
      { title: "Návrh k soudu", text: "Návrh podáváte sami. Vysvětlíme vám, co v něm nesmí chybět." },
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
    verify: [],
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
      { title: "Vymáhání nebo návrh", text: "Podle situace vymáháme dlužné výživné, nebo vám poradíme s návrhem k soudu." },
      { title: "Zastoupení", text: "Na základě plné moci jednáme za vás." },
    ],
    price: { title: "Kolik to stojí? Pro vás nic.", text: "Naši pomoc hradí dárci a partneři fondu." },
    faq: [
      {
        q: "Musí za mě jednat rodič, u kterého bydlím?",
        a: "Ne. Jako zletilý jednáte sami za sebe a plnou moc podepisujete vy.",
      },
      {
        q: "Co když výživné dosud stanovené nemám?",
        a: "O možnost výživné požadovat jste nepřišli. Pokud stále splňujete podmínky, podáte k soudu návrh na určení výživného. Uvedete v něm své odůvodněné potřeby, proč se nemůžete sami živit, a navrhnete konkrétní částku. Typickým důvodem je pokračující studium.",
      },
      {
        q: "Mohu chtít výživné od obou rodičů?",
        a: "Ano, od jednoho nebo od obou, podle vaší situace a možností a majetkových poměrů každého z rodičů. Když bydlíte s jedním z nich, může svou povinnost plnit i tím, že vám zajistí bydlení a stravu. Neznamená to automaticky, že každý platí polovinu.",
      },
      {
        q: "Jak soud určuje výši výživného?",
        a: "Posuzuje vaše odůvodněné potřeby (bydlení, strava, doprava, studium, oblečení, zdraví, kroužky) a zároveň příjmy, možnosti a majetkové poměry rodičů. Pevná částka neexistuje, každý případ se posuzuje zvlášť.",
      },
      {
        q: "Platí výživné stanovené před 18. rokem dál?",
        a: "Ano, pokud dál splňujete podmínky, nemusí se znovu stanovovat. Když se změní vaše potřeby nebo příjmy rodiče, můžete soud požádat o změnu výše.",
      },
      {
        q: "Co když přestanu studovat?",
        a: "Pokud se dál nepřipravujete na povolání ani nesplňujete jinou podmínku nezaopatřenosti, vyživovací povinnost do budoucna zaniká. Důležité je správně určit datum, ke kterému podmínky přestaly platit, a zohlednit ho i v exekučním řízení.",
      },
    ],
    verify: [],
  },
  {
    slug: "mediace",
    title: "Mediace",
    image: "topicPaperwork",
    card: "Dohoda místo sporu. Akreditovaní mediátoři pomohou rodičům domluvit se.",
    lead: "Mediace je mimosoudní cesta, jak se rodiče dohodnou na výživném a péči o dítě. Vedou ji akreditovaní mediátoři PhDr. Lenka Ranšová a JUDr. PhDr. Luděk Žákovec.",
    when: [
      "Chcete se s druhým rodičem dohodnout bez soudu.",
      "Oba rodiče jsou ochotni jednat.",
      "Potřebujete upravit výši výživného nebo péči.",
    ],
    need: ["Ochotu obou rodičů přijít na setkání.", "Základní přehled o nákladech na dítě."],
    flow: [
      { title: "Úvodní rozhovor", text: "Vysvětlíme, jak mediace probíhá." },
      { title: "Společná setkání", text: "Mediátor vede rozhovor tak, aby oba rodiče byli slyšet." },
      { title: "Dohoda", text: "Když se rodiče shodnou, zachytí se dohoda písemně v mediační dohodě." },
    ],
    price: { title: "Kolik to stojí?", text: "1 100 Kč za hodinu, obvykle napůl mezi oba rodiče. Telefonická konzultace je zdarma." },
    faq: [{ q: "Je mediace povinná?", a: "Ne, je dobrovolná. Oba rodiče se jí účastní z vlastní vůle." }],
    verify: [],
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
