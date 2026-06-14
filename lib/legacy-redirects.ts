/**
 * Legacy URL → new route map for 1:1 SEO preservation.
 *
 * The old WordPress site served every blog post AND FAQ answer at the root
 * (`/slug/`). The redesign serves them under `/blog/slug` and `/faq/slug`.
 * These 301s keep the old inbound links (and search rankings) alive.
 *
 * Slugs are preserved verbatim. The single corrupted slug (a stray U+FFFD
 * replacement char, `%EF%BF%BC`) is canonicalised and both forms redirect to
 * the clean one. See docs/06-migration-and-seo.md.
 *
 * Source of truth for the blog/FAQ split — also imported by
 * scripts/import-legacy-content.ts so content type and redirect target agree.
 */

/** FAQ answer pages (rendered at /faq/<slug>). Order = display order. */
export const LEGACY_FAQ_SLUGS = [
  "jak-postupovat-kdyz-dluznik-behem-exekuce-vstoupi-do-insolvence",
  "chci-exekuci-predcasne-ukoncit-zaplatim-neco-2",
  "co-delat-pokud-jsem-delsi-dobu-neobdrzel-a-zadnou-aktualizaci-k-memu-pripadu",
  "kdy-mohu-pozadat-o-nahradni-vyzivne-a-jaky-je-postup",
  "jak-dlouho-vymahani-trva-a-kdy-dostanu-prvni-penize-2",
  "jak-budu-o-exekucnim-rizeni-informovan-a-jak-se-mohu-informovat-ja",
  "co-je-to-vyznacena-dolozka-pravni-moci-na-rozsudku",
  "jiz-mam-vedenou-exekuci-je-neuspesna-mohu-proto-spolupracovat-s-vami",
  "mohu-vymahat-vyzivne-i-zpetne",
  "jak-vymahat-vyzivne-u-ditete-starsiho-18-let-2",
  "dluznik-v-prubehu-exekuce-vyhlasi-insolvenci-jak-dale-postupovat-2",
  "dluznik-je-v-insolvenci-co-mohu-udelat",
  "je-mozne-vymahat-vyzivne-z-ciziny-2",
  "dluznik-je-ve-vykonu-trestu-mohu-vyzivne-vymahat-2",
  "jak-dlouho-vymahani-trva-a-kdy-mohu-dostat-prvni-penize",
  "mohu-vyzivne-vymahat-i-kdyz-je-dluznik-nezamestnany-pracuje-nelegalne-nebo-nema-majetek",
  "kdy-mohu-vyzivne-zacit-vymahat-a-jaka-je-minimalni-castka",
  "mam-se-obratit-s-pomoci-vymahani-vyzivneho-na-vas-nebo-na-soud-2",
  "je-poskytovani-vasich-sluzeb-zdarma",
  "co-vse-je-treba-vedet-o-dluznem-a-budoucim-vyzivnem-v-exekuci",
  "jak-probiha-exekuce-na-vyzivnem",
] as const;

/** Blog / news article pages (rendered at /blog/<slug>). Canonical slugs. */
export const LEGACY_BLOG_SLUGS = [
  "novy-poplatek-za-odvolani-ve-vecech-pece-o-nezletile-dite-od-1-1-2026",
  "kdy-dostanete-superdavku-v-roce-2026-vyplata-se-posouva",
  "trestni-oznameni-na-neplaceni-vyzivneho-v-roce-2026",
  "nahradni-vyzivne-v-roce-2026-na-jakou-pomoc-mate-narok",
  "chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu",
  "zapsani-otce-do-rl-ditete-u-nesezdanych-paru",
  "zanik-vyzivovaci-povinnosti-na-dite",
  "vyzivne-na-zletile-dite",
  "vyzivne-na-neprovdanou-matku-a-uhrada-nakladu-spojenych-s-tehotenstvim-a-porodem",
  "vyzivne-mezi-manzeli",
  "uroky-z-prodleni-placeni-vyzivneho",
  "svereni-do-pece-a-urceni-vyzivneho",
  "nahradni-vyzivne-pomoc-proti-neplaticum",
  "zmena-vyse-vyzivneho",
  "proc-mi-nechodi-uz-od-zacatku-vsechny-strzene-penize",
  "jak-vymahat-vyzivne-v-pripade-ze-byvaly-partner-byvala-partnerka-vyhlasi-osobni-bankrot",
  "ma-smysl-vymahat-vyzivne-u-rodice-v-exekuci",
  "co-mam-delat-kdyz-dluznik-dluznice-po-uvaleni-exekuce-slibi-ze-vse-splati",
  "soudni-vykon-rozhodnuti-vs-exekucni-vymahani-vyzivneho",
  "mam-resit-dluh-exekuci-i-po-podani-trestniho-oznameni",
  "jak-budou-alimenty-vymozeny",
  "jak-mam-zazadat-o-zvyseni-vyzivneho",
  "co-je-to-navrh-na-urceni-vyzivneho-a-pece-o-dite",
  "mohu-vymahat-vyzivne-u-ditete-starsiho-18-let",
  "mohu-vymahat-vyzivne-zpetne",
  "jak-nejlepe-postupovat-kdyz-chci-vymahat-alimenty-exekuci",
  "jak-mam-postupovat-pokud-se-spolu-dokazeme-domluvit",
  "jak-mam-podat-zadost-na-soud-kvuli-vymereni-vyzivneho-byvaly-partner-byvala-partnerka-nechce-spolupracovat",
  "co-je-to-promlceni-vyzivneho",
  "mam-narok-na-vyzivne",
  "co-je-dolozka-pravni-moci-o-vykonatelnosti",
  "co-je-rozhodnuti-o-vysi-vyzivneho",
  "co-musim-udelat-abyste-mohli-zacit-vymahat-alimenty",
  "kolik-dostanu-z-dluzne-castky",
] as const;

/**
 * Same-topic duplicates consolidated into one canonical page. The `fromSlug`
 * page is archived (see scripts/import-legacy-content.ts) and 301'd to `to`.
 * Kept in LEGACY_*_SLUGS above so content classification on import is stable;
 * the redirect generator skips their generic entry and emits these instead.
 */
export const CONSOLIDATED_DUPLICATES = [
  {
    // Two FAQ entries asked the same "jak dlouho vymáhání trvá" question;
    // keep the richer answer, retire the shorter one.
    fromType: "faq",
    fromSlug: "jak-dlouho-vymahani-trva-a-kdy-mohu-dostat-prvni-penize",
    to: "/faq/jak-dlouho-vymahani-trva-a-kdy-dostanu-prvni-penize-2",
  },
] as const;

/**
 * Raw legacy slugs that contained URL-encoded junk, mapped to their canonical
 * form. The old site indexed both the lower- and upper-case percent encodings.
 */
export const CORRUPT_SLUG_REDIRECTS = [
  {
    encoded:
      "/chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu%EF%BF%BC",
    canonical:
      "chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu",
  },
  {
    encoded:
      "/chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu%ef%bf%bc",
    canonical:
      "chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu",
  },
] as const;

/**
 * Normalise a legacy WordPress slug to the canonical slug used in the new app.
 * Strips URL-encoding artifacts (e.g. the U+FFFD replacement char) and any
 * character outside `[a-z0-9-]`.
 */
export function canonicalSlug(raw: string): string {
  let s = raw;
  try {
    s = decodeURIComponent(raw);
  } catch {
    // leave raw if it isn't valid percent-encoding
  }
  return s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type Redirect = { source: string; destination: string; permanent: boolean };

/**
 * Build the full legacy → new redirect list for next.config `redirects()`.
 * Next.js normalises the trailing slash before matching, so a single
 * `/slug` source also covers the old `/slug/` form.
 */
export function legacyRedirects(): Redirect[] {
  const redirects: Redirect[] = [];

  const consolidated = new Set<string>(
    CONSOLIDATED_DUPLICATES.map((d) => d.fromSlug),
  );

  for (const slug of LEGACY_BLOG_SLUGS) {
    if (consolidated.has(slug)) continue;
    redirects.push({
      source: `/${slug}`,
      destination: `/blog/${slug}`,
      permanent: true,
    });
  }

  for (const slug of LEGACY_FAQ_SLUGS) {
    if (consolidated.has(slug)) continue;
    redirects.push({
      source: `/${slug}`,
      destination: `/faq/${slug}`,
      permanent: true,
    });
  }

  // Consolidated duplicates: 301 both the old root URL and the new typed path
  // to the canonical page.
  for (const { fromType, fromSlug, to } of CONSOLIDATED_DUPLICATES) {
    redirects.push(
      { source: `/${fromSlug}`, destination: to, permanent: true },
      { source: `/${fromType}/${fromSlug}`, destination: to, permanent: true },
    );
  }

  for (const { encoded, canonical } of CORRUPT_SLUG_REDIRECTS) {
    redirects.push({
      source: encoded,
      destination: `/blog/${canonical}`,
      permanent: true,
    });
  }

  // Annual-report PDFs moved out of /wp-content into /dokumenty.
  redirects.push(
    {
      source: "/wp-content/uploads/2026/03/VYROCNI-ZPRAVA-2023-SOS-vyzivne.pdf",
      destination: "/dokumenty/vyrocni-zprava-2023.pdf",
      permanent: true,
    },
    {
      source: "/wp-content/uploads/2026/03/VYROCNI-ZPRAVA-2024-SOS-vyzivne.pdf",
      destination: "/dokumenty/vyrocni-zprava-2024.pdf",
      permanent: true,
    },
  );

  // Old WordPress author archives (email-based slugs, with /page/N variants).
  // The redesign has no per-author archive, so point them at the article list.
  redirects.push({
    source: "/author/:path*",
    destination: "/blog",
    permanent: true,
  });

  // Elementor template artifact — never a real page.
  redirects.push({
    source: "/elementor-hf/:path*",
    destination: "/",
    permanent: true,
  });

  return redirects;
}
