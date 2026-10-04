/**
 * HTML versions of the annual reports (public/dokumenty/vyrocni-zprava-<year>.pdf).
 * Text is transcribed from the PDFs, not rewritten; finance figures are the
 * totals printed in the balance sheet and P&L (v celých tisících Kč).
 * Private individuals are listed as "soukromý dárce" (spec §11).
 */
export type AnnualReport = {
  year: 2025 | 2024 | 2023;
  pdf: string;
  introTitle: string;
  intro: string[];
  signedBy: string;
  highlights: string[];
  donationsReceived: { donor: string; amount?: string; note?: string }[];
  donationsGiven: string[];
  statistics: string[];
  finance: { label: string; value: string }[];
  audit: string;
};

export const REPORTS: AnnualReport[] = [
  {
    year: 2025,
    pdf: "/dokumenty/vyrocni-zprava-2025.pdf",
    introTitle: "Úvodní slovo",
    intro: [
      "Rok 2025 pro nás představoval období stabilizace, dalšího rozvoje a posilování jistoty v tom, jakým směrem se naše organizace ubírá. Po náročnějších předchozích obdobích můžeme s potěšením říci, že se naše činnost ustálila a získala pevné zázemí, které nám umožňuje soustředit se především na to nejdůležitější – pomoc dětem a rodinám v obtížné životní situaci.",
      "Významným krokem bylo upevnění spolupráce s Exekutorským úřadem pro Plzeň-jih, která se ukazuje jako klíčová pro efektivní a citlivé řešení případů našich klientů. Tato spolupráce přináší větší předvídatelnost, rychlejší postupy a v neposlední řadě také důstojnější přístup k rodinám, které se na nás obracejí.",
      "Rok 2025 byl také ve znamení aktivnější práce na rozvoji našich služeb. Začali jsme se systematicky věnovat fundraisingu, jehož cílem je zajistit dlouhodobou udržitelnost a další zkvalitňování našich aktivit.",
      "Současně jsme intenzivně pracovali na přípravě rozšíření našich služeb o akreditovanou mediaci, kterou vnímáme jako přirozený a velmi potřebný krok. Mediace nám umožní nabídnout rodinám cestu dialogu, porozumění a dohody – tedy řešení, která mohou přinést větší klid a menší zátěž především pro děti.",
    ],
    signedBy: "PhDr. Lenka Ranšová, DiS., ředitelka a členka správní rady",
    highlights: [
      "poskytli podporu stovkám klientů v rámci jejich individuálních případů",
      "řešili desítky složitých jednání s exekutorskými úřady, soudy a dalšími institucemi",
      "aktivně vstupovali do řízení formou podnětů a stížností ve veřejném zájmu",
      "rozšířili okruh nových klientů o více než 200 osob",
      "udrželi stabilní fungování organizace i v podmínkách finanční nejistoty",
    ],
    donationsReceived: [
      { donor: "SOS rodině s.r.o.", amount: "60 000 Kč", note: "úhrada nákladů na provoz" },
      { donor: "Nadace Agrofert", amount: "100 000 Kč" },
      { donor: "soukromý dárce", amount: "3 000 Kč" },
    ],
    donationsGiven: [],
    statistics: [
      "Mapa pokrytí ve výroční zprávě ukazuje klienty z celé České republiky.",
      "Poděkování partnerům: MACEK.LEGAL s.r.o., JUDr. Pavel Šíma, Nadace Agrofert, Oblastní charita Klatovy, Charita Most, Charita Litvínov, SOS Domažlice, OSPOD Domažlice, Úřad práce ČR a Ponton Plzeň.",
    ],
    finance: [
      { label: "Aktiva celkem", value: "309 tis. Kč" },
      { label: "Vlastní zdroje", value: "263 tis. Kč" },
      { label: "Cizí zdroje", value: "46 tis. Kč" },
      { label: "Výnosy celkem", value: "359 tis. Kč" },
      { label: "Náklady celkem", value: "214 tis. Kč" },
      { label: "Výsledek hospodaření", value: "145 tis. Kč" },
    ],
    audit:
      "Na základě provedené kontroly hospodaření SOS výživného nadačního fondu za účetní období roku 2025 mohu konstatovat, že účetnictví bylo vedeno pečlivě, přehledně a v souladu s platnou legislativou i interními pravidly fondu. V průběhu revize nebyly zjištěny žádné nedostatky ani pochybení. Hospodaření fondu za rok 2025 lze proto hodnotit jako transparentní a stabilní. (Simona Linhartová, revizorka, 31. 3. 2026)",
  },
  {
    year: 2024,
    pdf: "/dokumenty/vyrocni-zprava-2024.pdf",
    introTitle: "Úvodní slovo",
    intro: [
      "Rok 2024 byl pro nás rokem zkoušek, ale i důležitých změn a nových začátků. Po prvním roce fungování v podobě nadačního fondu jsme si potvrdili, že naše rozhodnutí transformovat původní strukturu ve prospěch maximální transparentnosti a efektivity bylo správné.",
      "Naše činnost v roce 2024 čelila nejen běžným výzvám souvisejícím s vymahatelností výživného, ale i složitým situacím vyvolaným neochotou některých institucí postupovat v souladu se zákonem a ve prospěch dětí. O to důležitější pro nás bylo nalezení nového a vstřícného partnera – Exekutorského úřadu pro Plzeň-jih – který nám otevřel dveře k efektivnímu řešení případů a k důstojnějšímu přístupu vůči rodinám v tíživé situaci.",
      "Naše mise ale pokračuje dál a rozvíjí se. Rok 2025 bude ve znamení rozšíření služeb o akreditovanou mediaci – formu mimosoudního řešení sporů, která staví na dialogu, respektu a hledání dohody mezi rodiči.",
    ],
    signedBy: "PhDr. Lenka Ranšová, DiS., ředitelka a členka správní rady",
    highlights: [
      "zpracovali stovky individuálních žádostí o pomoc",
      "vedli desítky složitých jednání s exekutorskými úřady a soudy",
      "podali stížnosti ve veřejném zájmu a stáli za svými klienty i ve složitých kauzách",
      "podpořili více než 200 nových klientů, kteří se na nás obrátili v zoufalé situaci",
      "i přes finanční nejistotu udrželi provoz a kontinuitu služeb",
    ],
    donationsReceived: [
      { donor: "SOS rodině s.r.o.", amount: "154 991 Kč", note: "úhrada nákladů na provoz během roku" },
    ],
    donationsGiven: [
      "Nepeněžité dary v hodnotě 31 500 Kč: encyklopedie ZVÍŘE pro ZŠ Sadská, Spolek při ZŠ a MŠ Praha-Vinoř, TJ Equus Kinsky, Statek Kočvary, z.s. a JK Farma Ptýrov, z.s.",
      "Příspěvek na obědy pro klienta (leden–červen 2024) ve výši 4 039 Kč.",
    ],
    statistics: [
      "Nová spolupráce 2024: od října fond převzal desítky exekucí k Exekutorskému úřadu Plzeň-jih (graf ve výroční zprávě).",
      "Mapa pokrytí ukazuje klienty z celé České republiky.",
    ],
    finance: [
      { label: "Aktiva celkem", value: "175 tis. Kč" },
      { label: "Vlastní zdroje", value: "118 tis. Kč" },
      { label: "Cizí zdroje", value: "57 tis. Kč" },
      { label: "Výnosy celkem", value: "206 tis. Kč" },
      { label: "Náklady celkem", value: "235 tis. Kč" },
      { label: "Výsledek hospodaření", value: "−29 tis. Kč" },
    ],
    audit:
      "Na základě kontroly hospodaření SOS výživného nadačního fondu za účetní období roku 2024 konstatuji, že účetnictví bylo vedeno řádně, v souladu s platnými právními předpisy a vnitřními směrnicemi fondu. Nebyly zjištěny žádné nedostatky, pochybení ani nehospodárné nakládání s finančními prostředky. Hospodaření nadačního fondu za rok 2024 lze označit za transparentní a bezproblémové. (Simona Linhartová, revizorka, 19. 4. 2025)",
  },
  {
    year: 2023,
    pdf: "/dokumenty/vyrocni-zprava-2023.pdf",
    introTitle: "Slovo zakladatele a něco málo z historie",
    intro: [
      "Svojí činnost jsme zahájili již v roce 2019, tehdy se zrodila myšlenka na organizaci, která by pomáhala lidem postaveným do nezáviděníhodné situace, kdy jim není řádně placeno výživné.",
      "Naše začáteční kroky by se daly mylně vnímat jako podnikatelské, vytvořili jsme společnost s ručením omezeným. O podnikání v pravém slova smyslu s vidinou zisku nám však nikdy nešlo. S rostoucím povědomím o potřebě transparentnosti a maximální efektivity ve prospěch těch, kteří potřebují naši pomoc, jsme se rozhodli transformovat SOS výživné do podoby SOS výživného nadačního fondu, převedli jsme se tak plně do neziskové sféry.",
      "Jsme vděční za podporu našich dárců, dobrovolníků a partnerů, kteří nám umožňují dosahovat pozitivních změn v životech těch, kteří se ocitli v obtížné životní situaci.",
    ],
    signedBy: "Erik Žákovec, zakladatel",
    highlights: [
      "pomoc s vymáháním výživného, včetně přípravy veškeré dokumentace a právního zastoupení",
      "pomoc se získáním náhradního výživného od státu",
      "předávání zkušeností a informací laické i odborné veřejnosti (úřady práce, OSPOD, charita)",
      "informace přes sociální sítě a webové stránky, účast na veřejných akcích",
      "psychická podpora klientů",
    ],
    donationsReceived: [
      { donor: "MACEK.LEGAL s.r.o., advokátní kancelář", amount: "5 000 Kč" },
      { donor: "soukromý dárce", amount: "5 000 Kč" },
      { donor: "SOS rodině s.r.o.", amount: "10 000 Kč" },
      { donor: "SOS rodině s.r.o.", amount: "542 293 Kč", note: "úhrada nákladů na provoz během roku" },
      { donor: "SOS ŽIVOT z.s.", note: "nepeněžitý dar: 400 encyklopedií ZVÍŘE v hodnotě 140 000 Kč" },
    ],
    donationsGiven: [
      "Nepeněžité dary v hodnotě 50 050 Kč: encyklopedie ZVÍŘE pro Diecézní charitu Plzeň, SOS Domažlice, Oblastní charitu Klatovy, Odbor sociálních věcí a zdravotnictví Domažlice, Českou maltézskou mládež a Ponton, z.s.",
      "Příspěvek na obědy pro klienta.",
    ],
    statistics: [
      "Klienti pobírající náhradní výživné: celkem 766 klientů v roce 2023.",
      "Chatbot na webu otevřelo 1 633 lidí a 413× si v něm spočítali výživné kalkulačkou.",
    ],
    finance: [
      { label: "Aktiva celkem", value: "198 tis. Kč" },
      { label: "Vlastní zdroje", value: "198 tis. Kč" },
      { label: "Cizí zdroje", value: "0 tis. Kč" },
      { label: "Výnosy celkem", value: "578 tis. Kč" },
      { label: "Náklady celkem", value: "591 tis. Kč" },
      { label: "Výsledek hospodaření", value: "−13 tis. Kč" },
    ],
    audit:
      "Ověřila jsem účetní závěrku za rok 2023 účetní jednotky SOS výživné nadační fond. Předložená účetní uzávěrka v této výroční zprávě zobrazuje věrně stav majetku a závazků nadačního fondu a účetnictví je vedeno v souladu se zákonem o účetnictví a příslušnými předpisy České republiky. Revizor neshledal žádné nedostatky. (Simona Linhartová, revizorka, 12. 4. 2024)",
  },
];

export function getReport(year: number) {
  return REPORTS.find((r) => r.year === year);
}
