# 06 — Migration, URL Map & SEO

## URL preservation principle

The current site has strong topical SEO (legal explainers ranking for *výživné* queries). **Preserve
every existing URL slug 1:1** to avoid losing rankings. Where the redesign changes a path, add a 301.
WordPress uses trailing slashes (`/slug/`); decide on a canonical trailing-slash policy in Next.js and
301 the other form consistently.

## Full URL inventory (from site map crawl)

### Top-level / functional
| URL | Keep as | Notes |
|-----|---------|-------|
| `/` | Home | |
| `/chci-pomoc-s-vymahanim-vyzivneho/` | Lead form | primary conversion |
| `/kalkulacka/` | Calculator | also linked as `sosvyzivne.cz/kalkulacka` (no www) — normalize host |
| `/faq/`, `/faq/2/` | FAQ hub (paginated) | |
| `/blog/`, `/blog/2/`, `/blog/3/`, `/blog/4/` | Blog list (paginated) | |
| `/kontakt/` | Donations + contact | |
| `/test/` | **DROP** | stray Elementor test page — 410/redirect to `/` |
| `/elementor-hf/footer-call-to-action` | **DROP** | Elementor template artifact, not a real page |

### Blog / news articles
| Slug |
|------|
| `/novy-poplatek-za-odvolani-ve-vecech-pece-o-nezletile-dite-od-1-1-2026/` |
| `/kdy-dostanete-superdavku-v-roce-2026-vyplata-se-posouva/` |
| `/trestni-oznameni-na-neplaceni-vyzivneho-v-roce-2026/` |
| `/nahradni-vyzivne-v-roce-2026-na-jakou-pomoc-mate-narok/` |
| `/nahradni-vyzivne-pomoc-proti-neplaticum/` |
| `/chystana-zmena-v-orientacnich-tabulkach-pro-vypocet-vyzivneho-dostava-svou-podporu…/` ⚠ |
| `/zapsani-otce-do-rl-ditete-u-nesezdanych-paru/` |
| `/zanik-vyzivovaci-povinnosti-na-dite/` |
| `/vyzivne-na-zletile-dite/` |
| `/vyzivne-na-neprovdanou-matku-a-uhrada-nakladu-spojenych-s-tehotenstvim-a-porodem/` |
| `/vyzivne-mezi-manzeli/` |
| `/uroky-z-prodleni-placeni-vyzivneho/` |
| `/svereni-do-pece-a-urceni-vyzivneho/` |
| `/nahradni-vyzivne-pomoc-proti-neplaticum/` |
| `/zmena-vyse-vyzivneho/` |
| `/proc-mi-nechodi-uz-od-zacatku-vsechny-strzene-penize/` |
| `/jak-vymahat-vyzivne-v-pripade-ze-byvaly-partner-byvala-partnerka-vyhlasi-osobni-bankrot/` |
| `/ma-smysl-vymahat-vyzivne-u-rodice-v-exekuci/` |
| `/co-mam-delat-kdyz-dluznik-dluznice-po-uvaleni-exekuce-slibi-ze-vse-splati/` |
| `/soudni-vykon-rozhodnuti-vs-exekucni-vymahani-vyzivneho/` |
| `/mam-resit-dluh-exekuci-i-po-podani-trestniho-oznameni/` |
| `/jak-budou-alimenty-vymozeny/` |
| `/jak-mam-zazadat-o-zvyseni-vyzivneho/` |
| `/co-je-to-navrh-na-urceni-vyzivneho-a-pece-o-dite/` |
| `/mohu-vymahat-vyzivne-u-ditete-starsiho-18-let/` |
| `/mohu-vymahat-vyzivne-zpetne/` |
| `/jak-nejlepe-postupovat-kdyz-chci-vymahat-alimenty-exekuci/` |
| `/jak-mam-postupovat-pokud-se-spolu-dokazeme-domluvit/` |
| `/jak-mam-podat-zadost-na-soud-kvuli-vymereni-vyzivneho-byvaly-partner-byvala-partnerka-nechce-spolupracovat/` |
| `/co-je-to-promlceni-vyzivneho/` |
| `/mam-narok-na-vyzivne/` |
| `/co-je-dolozka-pravni-moci-o-vykonatelnosti/` |
| `/co-je-rozhodnuti-o-vysi-vyzivneho/` |
| `/co-musim-udelat-abyste-mohli-zacit-vymahat-alimenty/` |
| `/kolik-dostanu-z-dluzne-castky/` |
| `/nahradni-vyzivne-pomoc-proti-neplaticum/` |
| `/jak-mam-zazadat-o-zvyseni-vyzivneho/` |

⚠ The "chystaná změna…" slug contains a trailing encoded special char (`%ef%bf%bc` /
`%EF%BF%BC` = U+FFFD replacement char). The crawl found **two** variants. Canonicalize to one clean
slug and 301 both encoded forms to it.

### FAQ answer pages (distinct from blog; some duplicate topics with `-2` suffixes)
| Slug |
|------|
| `/jak-postupovat-kdyz-dluznik-behem-exekuce-vstoupi-do-insolvence/` |
| `/chci-exekuci-predcasne-ukoncit-zaplatim-neco-2/` |
| `/co-delat-pokud-jsem-delsi-dobu-neobdrzel-a-zadnou-aktualizaci-k-memu-pripadu/` |
| `/kdy-mohu-pozadat-o-nahradni-vyzivne-a-jaky-je-postup/` |
| `/jak-dlouho-vymahani-trva-a-kdy-dostanu-prvni-penize-2/` |
| `/jak-dlouho-vymahani-trva-a-kdy-mohu-dostat-prvni-penize/` |
| `/jak-budu-o-exekucnim-rizeni-informovan-a-jak-se-mohu-informovat-ja/` |
| `/co-je-to-vyznacena-dolozka-pravni-moci-na-rozsudku/` |
| `/jiz-mam-vedenou-exekuci-je-neuspesna-mohu-proto-spolupracovat-s-vami/` |
| `/mohu-vymahat-vyzivne-i-zpetne/` |
| `/jak-vymahat-vyzivne-u-ditete-starsiho-18-let-2/` |
| `/dluznik-v-prubehu-exekuce-vyhlasi-insolvenci-jak-dale-postupovat-2/` |
| `/dluznik-je-v-insolvenci-co-mohu-udelat/` |
| `/je-mozne-vymahat-vyzivne-z-ciziny-2/` |
| `/dluznik-je-ve-vykonu-trestu-mohu-vyzivne-vymahat-2/` |
| `/mohu-vyzivne-vymahat-i-kdyz-je-dluznik-nezamestnany-pracuje-nelegalne-nebo-nema-majetek/` |
| `/kdy-mohu-vyzivne-zacit-vymahat-a-jaka-je-minimalni-castka/` |
| `/mam-se-obratit-s-pomoci-vymahani-vyzivneho-na-vas-nebo-na-soud-2/` |
| `/je-poskytovani-vasich-sluzeb-zdarma/` |
| `/co-vse-je-treba-vedet-o-dluznem-a-budoucim-vyzivnem-v-exekuci/` |
| `/jak-probiha-exekuce-na-vyzivnem/` |

> **Duplicate-topic cleanup:** several pairs cover the same question (e.g.
> `mohu-vymahat-vyzivne-zpetne` vs `mohu-vymahat-vyzivne-i-zpetne`;
> `mohu-vymahat-vyzivne-u-ditete-starsiho-18-let` vs `…-2`;
> the two "jak dlouho vymáhání trvá…" pages). Pick the canonical version, 301 the duplicate, and
> consolidate content to avoid keyword cannibalization. Audit each pair during migration.

### Author archives
- `/author/veronika-tumovasefbot-cz/` → `/autor/veronika-tumova/`
- `/author/erik-zakovecsosvyzivne-cz/` (+ `/page/2`, `/page/3`) → `/autor/lenka-ransova/`
- `/author/janruzickainternational-eu/` (+ `/page/2`) → `/autor/jan-ruzicka/`

### Assets (keep paths or redirect)
- `/wp-content/uploads/2026/03/VYROCNI-ZPRAVA-2023-SOS-vyzivne.pdf`
- `/wp-content/uploads/2026/03/VYROCNI-ZPRAVA-2024-SOS-vyzivne.pdf`
- Move to `/dokumenty/vyrocni-zprava-2023.pdf` etc. and 301 the old `/wp-content/...` paths
  (external sites / search may link them).

## Redirect map (legacy → new)

If slugs are preserved (recommended), most redirects are just **host + trailing-slash normalization**:

```
http://sosvyzivne.cz/*          → https://www.sosvyzivne.cz/*   (or pick non-www; be consistent)
https://sosvyzivne.cz/kalkulacka → https://www.sosvyzivne.cz/kalkulacka/
/test/                          → /                              (410 or 301)
/elementor-hf/*                 → /                              (410)
/author/<old-email-slug>/       → /autor/<clean-slug>/
/wp-content/uploads/.../*.pdf   → /dokumenty/*.pdf
<duplicate FAQ/blog slug>       → <canonical slug>               (per audit)
%EF%BF%BC encoded slug variants → clean slug
```

Implement in `next.config` `redirects()` (or middleware for patterns). Keep the list in version control.

## SEO metadata baseline (from current site)

- `lang=cs`, `og:locale=cs_CZ`, Twitter `summary_large_image`.
- Default OG image currently the logo on inner pages — replace with a branded OG template per page.
- Home title: *SOSvyzivne.cz - Pomůžeme vám získat alimenty, na které máte právo*.
- Robots currently `max-image-preview:large` — keep.
- Add: canonical tags, `FAQPage`/`Article` JSON-LD, XML sitemap, `Organization` schema with
  `legalName`, `taxID` (IČO), address, `sameAs` (Facebook), `email`, `telephone`.

## Analytics & compliance (CZ/EU)

- Cookie/consent banner (TTDSG/GDPR) before loading analytics; prefer cookieless (Plausible) to
  minimize consent friction.
- Privacy policy (Zásady ochrany osobních údajů) + lead-form consent — **required** since the form
  collects name/email/phone/PSČ.
- Accessibility statement recommended (non-profit, public-interest).

## Launch checklist

- [ ] All legacy URLs resolve (200) or 301 to canonical — crawl old sitemap, diff against new.
- [ ] Redirect map deployed & tested (host, trailing slash, duplicates, authors, PDFs).
- [ ] Lead form delivers email to `info@sosvyzivne.cz`; spam protection live; GDPR consent present.
- [ ] Calculator output matches legacy tool (port exact MoJ table — see `05`).
- [ ] JSON-LD validates (Rich Results test); sitemap.xml + robots.txt live.
- [ ] Core Web Vitals green on mobile; fonts no-FOUT; images optimized.
- [ ] a11y AA pass (contrast, labels, focus, keyboard, skip link).
- [ ] OG images render correctly when shared (esp. Facebook — primary social channel).
- [ ] Org/contact data matches reality; **resolve Thursday-hours discrepancy** (14:00 vs 16:00).
- [ ] Annual report PDFs accessible at new paths; old paths redirect.
- [ ] Google Search Console: submit new sitemap, monitor coverage & 404s post-launch.
- [ ] Set up 404 monitoring for the first weeks to catch missed legacy URLs.

## Open items to confirm before/while building

1. ~~**Exact calculator algorithm**~~ — ✅ **RESOLVED 2026-06-13.** Recovered from the live page's
   inline JS. Flat % of net income per child by age bracket (0–5: 11%, 6–9: 13%, 10–14: 15%,
   15–17: 17%, 18+: 19%), summed, total rounded, **no sibling factor**. Full spec + port in `05`.
   (Open sub-question: the legacy tool diverges from the *official* MoJ table — decide whether to keep
   the simplified legacy %s for parity or upgrade to the real table; default = keep parity.)
2. **Thursday office hours** — 14:00 (footer) vs 16:00 (kontakt page).
3. **www vs non-www** canonical host.
4. **Duplicate FAQ/blog pages** — which slug is canonical for each pair.
5. **CMS vs MDX** — will non-technical staff edit content? Drives the content layer choice.
6. **Lead destination** — email only, or also CRM/spreadsheet/Datová schránka workflow.
