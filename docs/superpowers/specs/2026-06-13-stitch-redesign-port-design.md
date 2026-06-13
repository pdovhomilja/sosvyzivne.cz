# Spec — Port Google Stitch redesign into the app

**Date:** 2026-06-13
**Status:** Approved for planning
**Scope:** Faithful port of the Google Stitch designs into the existing Next.js 16 app, across all 7 screens (6 generated + 1 retried/hand-built Contact page).

---

## 1. Goal

Adopt the specific layouts and section compositions Stitch generated, replacing the
current page markup, **without changing any application behavior**: i18n, CMS data,
forms, the alimony calculator, SEO metadata, JSON-LD, and the `ORG` source-of-truth all
keep working exactly as today.

This is a **visual/markup port**, not a re-architecture. The brand (tokens, fonts) is
already implemented and matches the Stitch design system.

## 2. Source of truth

- **Stitch markup:** `.stitch-export/{home,lead-form,calculator,faq,blog,article}.html`
  (downloaded HTML — the literal structure/classes to port).
- **Images:** `public/images/stitch/*.jpg` + `public/images/stitch/manifest.json`
  (per-page list of `{file, alt, data_alt, url}`). 20 unique images already downloaded.
- **Stitch project:** `projects/9167525577675138775`, design system `assets/15136806289401258041`.

## 3. Hard constraints

- **Next.js 16 / React 19.** Per `AGENTS.md`, consult `node_modules/next/dist/docs/`
  before using framework APIs. Already in use here: async `params`/`searchParams`
  (Promises), `proxy.ts` (not middleware), `setRequestLocale`, next-intl v4.
- **Preserve these contracts unchanged** (signatures + behavior):
  - `lib/calculator.ts` — `AGE_BRACKETS`, `estimateSupport(netIncome, number[])`.
  - `app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/actions.ts` — `submitLead`, `LeadState`,
    zod schema, honeypot field `website`, Resend send.
  - `lib/cms/blog.ts` — `getPublishedPosts`, `getLatestPosts`, `getPostBySlug`.
  - `lib/cms/faq.ts` — `getFaqs`, `getFaqBySlug`, `FaqItem`.
  - `components/cms/RichText.tsx`, `lib/seo/metadata.ts` (`socialMetadata`), `lib/org.ts` (`ORG`).
  - Each page keeps its `export const metadata` / `generateMetadata` and `export const dynamic = "force-dynamic"` where present.
- **Czech copy** stays inline in JSX (matches current convention). Existing next-intl
  namespaces (`site`, `nav`, `cta`, `auth`) keep their roles. No new message keys required.
- **Links** use `Link` from `@/i18n/navigation` (never bare `next/link`) and real routes.
- **No new heavy dependencies.** Use existing deps: lucide-react, Radix Dialog, CVA, next/font, next/image.

## 4. Global changes

### 4.1 Design tokens — `app/globals.css`

Extend the existing `@theme` block with Stitch's alias names so ported utility classes
resolve without find-replace. Same hex values as existing tokens:

| Stitch class root | Hex | Maps to existing |
|---|---|---|
| `peach` | `#F8C0BA` | secondary |
| `peach-light` | `#FDEBE9` | secondary-tint |
| `terracotta` | `#CD625D` | accent |
| `ink` / `ink-muted` | `#2A2320` / `#6B5F5A` | (already exist) |
| `hairline` | `#ECE2DF` | border |
| `surface` / `surface-subtle` | `#FFFFFF` / `#FBF7F6` | surface / surface-muted |

Add: `--color-peach`, `--color-peach-light`, `--color-terracotta`, `--color-hairline`,
`--color-surface-subtle`, and the Stitch radii (`--radius-lg: 1rem`, `--radius-xl: 1.5rem`).
Keep all existing tokens. Add small custom CSS that Stitch relied on (accordion transition,
`.focus-ring`) only if a component needs it; prefer Tailwind utilities + Radix where possible.

Font mapping: Stitch `font-headline` → Playfair (`--font-heading`), `font-body` → Open Sans
(`--font-body`). Stitch's `font-label` (Public Sans) maps to Open Sans — **documented deviation**
(we do not add Public Sans).

### 4.2 Icons

Replace every `<span class="material-symbols-outlined">name</span>` with a lucide-react
component. Mapping (complete set found in the exports):

`add`→Plus, `arrow_forward`→ArrowRight, `calendar_today`→Calendar, `call`→Phone,
`check_circle`→CheckCircle2, `chevron_left`→ChevronLeft, `chevron_right`→ChevronRight,
`close`→X, `download`→Download, `edit`→Pencil, `expand_more`→ChevronDown, `face_nod`→(avatar img/UserRound),
`favorite`→Heart, `fingerprint`→Fingerprint, `info`→Info, `location_on`→MapPin, `mail`→Mail,
`menu`→Menu, `photo_camera`→Camera, `schedule`→Clock, `search`→Search, `share`→Share2,
`star`→Star, `sync`→RefreshCw.

### 4.3 Images

- All photos served from `public/images/stitch/` via `next/image` with explicit width/height
  (or `fill` + aspect container, matching Stitch's `object-cover` blocks).
- `alt` text: use manifest `alt` when present, else a concise Czech alt derived from `data_alt`.
- Treat as swappable placeholders (AI-generated). No `next.config` remotePatterns needed.

## 5. Shared chrome

Chrome remains rendered globally in `app/[locale]/layout.tsx` (`Header` → `main` → `CtaBand` → `Footer`).

### 5.1 `components/layout/Header.tsx` (server) + new `MobileNav` (client)
- Sticky white header (`sticky top-0 z-…`), terracotta utility bar above it (email, hours, phone, Facebook — from `ORG`).
- Desktop nav: O nás (`/`), Často kladené dotazy (`/faq`), Blog (`/blog`), Podpořte naši činnost (`/kontakt`); search icon (visual only unless search exists — render as non-functional control or omit; **decision: render disabled/decorative search icon**, documented); outline `Kalkulačka výživné` (`/kalkulacka`); prominent pink pill `Chci pomoc` (`/chci-pomoc-s-vymahanim-vyzivneho`).
- Mobile: hamburger opens `MobileNav` drawer (Radix `Dialog`); `Chci pomoc` stays visible outside the drawer. Keyboard-operable, focus-trapped (Radix handles), visible pink focus rings.
- Nav labels keep using `next-intl` `getTranslations("nav")`.

### 5.2 new `components/layout/PromoRibbon.tsx` (client)
- Thin dismissible bar: "Stát uhradí za neplatiče výživné → více informací". Rendered on Home only (below header). Dismiss state in component (sessionStorage optional, not required).

### 5.3 `components/layout/CtaBand.tsx`
- Restyle to Stitch CTA band (soft pink/peach, serif headline + subtext + pink pill). Keep `getTranslations("cta")` and link target.

### 5.4 `components/layout/Footer.tsx`
- Restyle to Stitch footer (logo + tagline, Kontakt block, Adresa block, copyright). All values from `ORG`.

## 6. UI primitives

- `components/ui/button.tsx`: confirm variants cover Stitch buttons (primary pill, outline, ghost/secondary). Extend variants/sizes only if a Stitch button can't be expressed; do not break existing call sites.
- Add small presentational components as needed, each single-purpose:
  `SectionHeading` (centered serif H2), `Card` wrappers are inline per page (cards differ enough).

## 7. Per-page port

Each page: replace body markup with the Stitch structure (adapted per §4), keep the page's
data fetching, metadata, and dynamic flags. Home is decomposed into section components under
`components/home/`.

### 7.1 Home — `app/[locale]/page.tsx` + `components/home/*`
Sections top→bottom (alternating white / `peach-light`):
1. `PromoRibbon` (chrome, see §5.2)
2. `Hero` — full-width warm photo (`home-01`), serif H1 "Nečekejte! Získejte výživné, na které mají vaše děti nárok.", sub-line, pink pill "Jak začít?" (anchors to steps).
3. `AboutBlock` — H2 "O nás", two-column rich text + rounded photo, two outline buttons "Výroční zpráva 2023/2024".
4. `AudienceCards` — H2 "Mám nárok na vaši službu?", 3 cards w/ photo + title + text (Rodič samoživitel/ka, Rozvedený/á, Plnoletý student).
5. `Steps` — H2 "Jak postupovat?" on peach tint, 3 numbered steps + pink pill "Chci pomoc". Anchor target for hero CTA (`id="jak"`, `scroll-mt`).
6. `BlogTeasers` — H2 "Novinky z blogu", 3 cards from `getLatestPosts(locale, 3)` (thumbnail, title, excerpt, "Celý článek »") + "Zobrazit vše". Renders only when posts exist (keep current try/catch + empty guard).
7. `MediaStrip` — grayscale logo strip (iDNES, ČT, iRozhlas, TV Nova, CNN Prima) — text/SVG placeholders.
8. `Testimonials` — 3 cards (5-star, quote, avatar, first name: Alena, František, Jana). Static copy.

Keep `force-dynamic` and `getLatestPosts` try/catch (DB may be absent).

### 7.2 Lead form — `chci-pomoc-s-vymahanim-vyzivneho/page.tsx` + `ContactForm.tsx`
- Two-column Stitch layout (form left, peach contact panel right) that stacks on mobile.
- `ContactForm` keeps `useActionState(submitLead)`, all fields (`jmeno,email,telefon,psc,zprava,souhlas,website`), error rendering, and success state — only classes/markup restyled to Stitch inputs (8–12px radius, pink focus). Right panel uses `ORG` (phone, hours, email) + trust line "Volání i poradenství jsou zdarma."

### 7.3 Calculator — `kalkulacka/page.tsx` + `Calculator.tsx`
- Restyle to Stitch single-column tool. `Calculator` keeps state, `AGE_BRACKETS`, `estimateSupport`, add/remove child rows, result card. Restyle inputs/selects/result card (peach result card) only. Keep disclaimer + CTA. Stitch's extra "Proč je důležité znát své nároky?" section can be included as static prose.

### 7.4 FAQ — `faq/page.tsx`
- Stitch accordion styling applied over the existing native `<details>` elements + chevron icon that rotates on open (CSS via `[open]`). Keep `getFaqs(locale)`, ordering, JSON-LD, `force-dynamic`, empty state. Pagination: Stitch shows static "1 2 3 4"; **only render pagination if the data layer paginates** — current `getFaqs` returns all, so render no fake pager (documented; or add simple client-side paging later — out of scope).

### 7.5 Blog list — `blog/page.tsx`
- Stitch 3-col card grid (thumbnail, title, excerpt, date, "Celý článek »", hover lift) over `getPublishedPosts`. Keep pagination logic (real `data.pages`). Thumbnails: post image if available in CMS, else a rotating Stitch placeholder from manifest. Keep empty state + `force-dynamic`.

### 7.6 Article — `blog/[slug]/page.tsx`
- Stitch article layout: breadcrumb, serif H1, meta line (author · date from `publishedAt`), prose body via `RichText` (keep `.prose-cms`), optional desktop TOC (static/á best-effort — may omit if not derivable; documented), "Související články" row (2–3 from `getLatestPosts`/related), JSON-LD. Keep `notFound()`, `generateMetadata`, `force-dynamic`. Apply the same shell to `faq/[slug]` if present.

### 7.7 Contact / Support — `kontakt/page.tsx`
- **Primary:** port the retried Stitch design once it lands (poll `list_screens`/`get_project`; download HTML+images like the others).
- **Fallback (if it fails again):** hand-build in the same visual language: H1 "Podpořte naši činnost", donation prose, donation card (peach) with `ORG.donationAccount` large + "Kopírovat číslo účtu" (client copy button) + QR placeholder, contact block from `ORG`, map embed placeholder "Kancelář Kralovice". Keep existing `metadata`.

## 8. Accessibility (WCAG 2.2 AA — already a project standard)

- Body ≥16px, contrast ≥4.5:1, visible pink focus rings on all interactive elements.
- Real `<label>`s (forms already compliant). Mobile drawer keyboard-operable + focus-trapped.
- One `<h1>` per page; logical heading order. Decorative icons `aria-hidden`; icon-only controls get `aria-label`.
- Respect existing `prefers-reduced-motion` block (hover lifts/scale transitions must degrade).
- `next/image` requires meaningful `alt` (from manifest) or `alt=""` for decorative.

## 9. Risks & open items

- **Search icon** in header is decorative (no search backend) — rendered as a non-actionable/disabled control. Revisit if search is added.
- **FAQ/article pagination & TOC** are visual-only in Stitch; we render real ones only where data supports it, otherwise omit (no fake controls).
- **Contact page** depends on a flaky Stitch generation; fallback defined.
- **Images** are AI placeholders; expected to be swapped for real photography. ~6 MB committed under `public/images/stitch/` (acceptable; revisit if repo-size matters).
- `font-label`/Public Sans not added — minor deviation from Stitch.

## 10. Verification

- `pnpm lint` clean; TypeScript builds.
- `pnpm dev` and visually compare each route against `.stitch-export/*.html` and the Stitch project screenshots.
- Functional smoke: calculator computes; lead form validates + shows success/error; blog/faq render from CMS (and degrade gracefully when DB absent); mobile drawer opens/closes via keyboard; promo ribbon dismisses.
- Accessibility pass: focus rings visible, headings ordered, images have alt, drawer focus-trapped.

## 11. Out of scope

CMS/admin UI, auth flows, DB schema, the alimony formula, copywriting beyond existing/Stitch
text, the second (en) locale, real search, real map integration.
