import type { ImageKey } from "@/lib/site/images";

/** Team as confirmed by Lenka Ranšová (e-mail 30. 9. 2026). */
export const TEAM: { name: string; role: string; image: ImageKey }[] = [
  { name: "PhDr. Lenka Ranšová, DiS.", role: "ředitelka, poradenství, mediace", image: "lenka" },
  { name: "Eva Koukolíková", role: "odborná poradkyně, administrativa", image: "teamEva" },
  { name: "Mgr. Daniel Macek", role: "zastupující advokát klientů, právní poradenství", image: "teamMacek" },
  { name: "Mgr. Zuzana Bořutová", role: "právní poradenství", image: "teamBorutova" },
  { name: "JUDr. PhDr. Luděk Žákovec, Ph.D.", role: "právní poradenství, akreditovaný mediátor", image: "teamLudek" },
];
