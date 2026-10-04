export type NavItem = { href: string; label: string };

/** Every public route of the site. Nav/footer links must point to one of these. */
export const ROUTES = [
  "/",
  "/o-nas",
  "/jak-pomahame",
  "/jak-pomahame/vymahani-vyzivneho",
  "/jak-pomahame/nahradni-vyzivne",
  "/jak-pomahame/zvyseni-vyzivneho",
  "/jak-pomahame/zletili-studenti",
  "/jak-pomahame/mediace",
  "/vyrocni-zpravy",
  "/podporte-nas",
  "/pruvodce",
  "/chci-pomoc-s-vymahanim-vyzivneho",
  "/kalkulacka",
  "/blog",
  "/faq",
  "/kontakt",
  "/zasady-ochrany-osobnich-udaju",
  "/hledat",
] as const;

export const NAV: NavItem[] = [
  { href: "/jak-pomahame", label: "Jak pomáháme" },
  { href: "/jak-pomahame/mediace", label: "Mediace" },
  { href: "/o-nas", label: "O nás" },
  { href: "/vyrocni-zpravy", label: "Výroční zprávy" },
  { href: "/faq", label: "Poradna" },
  { href: "/podporte-nas", label: "Podpořte nás" },
];

export const HELP_CTA: NavItem = { href: "/chci-pomoc-s-vymahanim-vyzivneho", label: "Chci pomoc" };

export const FOOTER_HELP: NavItem[] = [
  { href: "/jak-pomahame/vymahani-vyzivneho", label: "Vymáhání výživného" },
  { href: "/jak-pomahame/nahradni-vyzivne", label: "Náhradní výživné" },
  { href: "/jak-pomahame/zvyseni-vyzivneho", label: "Zvýšení výživného" },
  { href: "/jak-pomahame/zletili-studenti", label: "Zletilí studenti" },
  { href: "/jak-pomahame/mediace", label: "Mediace" },
  { href: "/kalkulacka", label: "Kalkulačka" },
];

export const FOOTER_FUND: NavItem[] = [
  { href: "/o-nas", label: "O nás" },
  { href: "/vyrocni-zpravy", label: "Výroční zprávy" },
  { href: "/podporte-nas", label: "Podpořte nás" },
  { href: "/blog", label: "Blog" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/zasady-ochrany-osobnich-udaju", label: "Ochrana osobních údajů" },
];
