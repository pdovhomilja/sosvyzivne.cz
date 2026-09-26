import type { ImageKey } from "@/lib/site/images";

/** Team as listed in Výroční zpráva 2025 (str. 8–9). */
export const TEAM: { name: string; role: string; image: ImageKey }[] = [
  { name: "PhDr. Lenka Ranšová, DiS.", role: "ředitelka, poradenství, mediace", image: "lenka" },
  { name: "Erik Žákovec", role: "zakladatel, správní rada", image: "teamErik" },
  { name: "Eva Koukolíková", role: "dobrovolnice, poradenství", image: "teamEva" },
  { name: "Mgr. Daniel Macek", role: "advokát, zastupování klientů", image: "teamMacek" },
  { name: "Mgr. Zuzana Bořutová", role: "advokátka, právní poradenství", image: "teamBorutova" },
  { name: "JUDr. PhDr. Luděk Žákovec, Ph.D.", role: "právní poradenství", image: "teamLudek" },
];
