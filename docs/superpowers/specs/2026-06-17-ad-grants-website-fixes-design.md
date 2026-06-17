# Design: Ad Grants Website-Policy Fixes

**Date:** 2026-06-17
**Status:** Approved (design) — pending spec review
**Related:** `docs/google-ad-grants-website-checklist.md`

## Goal

Resolve every issue surfaced in the Google Ad Grants website-policy audit of
`sosvyzivne.cz`, so the site passes review without "non-functional element",
"slow load", or "missing privacy" flags. Six independent fixes plus a verification
pass.

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Disabled header search button | **Implement** a real site search (blog + FAQ) |
| Donation QR placeholder | **Generate a real Czech SPD QR** code |
| Map placeholder | **Google Maps embed**, consent-gated (click-to-load) |
| Privacy Policy page | **Include** in this plan |
| Search scope | Blog + FAQ only (not static pages) |
| Homepage perf | Drop `force-dynamic`, use ISR |

**Open confirmation (non-blocking):** correct Thursday office-hours closing time
(`lib/org.ts` currently `08:00 – 14:00`; `docs/06` flags 14:00 vs 16:00). One-line
edit once confirmed.

---

## Units of work

### 1. Site search (replaces disabled header button)
- **Route:** `app/[locale]/hledat/page.tsx`, reads `?q=` from `searchParams`.
- **Query logic:** `lib/cms/search.ts` — searches published blog posts + FAQ
  (title + body) via Postgres `ILIKE` (or `to_tsvector` if straightforward),
  returns a unified, typed result list. Each result links to `/blog/[slug]` or
  `/faq/[slug]` and carries a type badge.
- **Header (`components/layout/Header.tsx`):** the currently `disabled`,
  `opacity-50` search button becomes functional — opens an inline input /
  submits to `/hledat?q=…`. Mobile: add a search entry in
  `components/layout/MobileNav.tsx`.
- **States:** empty state when `q` is absent; "no results" state when nothing
  matches. Reuse existing list/card styling from blog list.
- **Indexing:** add `/hledat` to `robots.ts` `disallow`; do **not** add to
  `sitemap.ts`.

### 2. Real donation QR (`/kontakt`)
- **Helper:** `lib/payment-qr.ts` — build a Czech **SPD** (Short Payment
  Descriptor) string from `ORG.donationAccount`:
  - Convert the domestic account (`131-1390040247/0100`) to IBAN.
  - Compose `SPD*1.0*ACC:<IBAN>*CC:CZK*MSG:Dar SOS vyzivne` (no fixed amount).
- **Render:** server-side QR (e.g. `qrcode` lib → inline `<svg>` / data-URL) so
  no client JS is required. Replaces the dashed "QR platba" placeholder in
  `app/[locale]/kontakt/page.tsx`. Keep the existing account number + copy button.

### 3. Google Maps embed (`/kontakt`)
- Replace the faux-map placeholder with a **consent-gated** map for the Kralovice
  office (`ORG.office`).
- **Click-to-load:** render a static card ("Zobrazit mapu") by default; on click,
  swap in the Google Maps `<iframe>`. This prevents Google cookies from loading
  before user action — consistent with the existing cookie-consent posture.
- New small client component (e.g. `components/contact/OfficeMap.tsx`).

### 4. Homepage performance (`app/[locale]/page.tsx`)
- Remove `export const dynamic = "force-dynamic"`.
- Switch to ISR: `export const revalidate = 3600` (or cache `getLatestPosts`).
- Preserve the existing try/catch fallback (render without blog teasers if DB is
  unavailable).

### 5. Office-hours discrepancy (`lib/org.ts`)
- Single edit to `ORG.hours` Thursday value once the correct closing time is
  confirmed. All surfaces (header/footer/contact) read from `ORG`, so one change
  propagates.

### 6. Privacy Policy page
- **Route:** `app/[locale]/zasady-ochrany-osobnich-udaju/page.tsx` —
  "Zásady ochrany osobních údajů". Covers: data collected, cookies, PostHog
  analytics (consent-gated), legal basis, contact for data-subject requests
  (reads `ORG`). Czech content in `messages/cs.json` where appropriate.
- **Footer:** add link in `components/layout/Footer.tsx` bottom bar (next to the
  cookie-settings link).
- **Sitemap:** add the route to `STATIC_PATHS` in `app/sitemap.ts`.

---

## Out of scope
- Non-website Ad Grants policies (5% CTR, conversion tracking, ad/keyword
  structure) — tracked separately in the checklist doc.
- Search over static marketing pages.
- Real-time/full-text relevance ranking beyond simple matching.

## Verification (post-implementation)
- `pnpm build` + `pnpm lint` clean.
- PageSpeed Insights (mobile) on the homepage.
- Mobile-Friendly Test.
- Broken-link sweep.
- Confirm no mixed-content warnings in production; HTTP→HTTPS redirect holds.
- Manual: search returns results; QR scans in a banking app; map loads only after
  click; privacy page reachable from footer.

## Conventions reminder
Per `AGENTS.md`: this is a modified Next.js — read the relevant guide in
`node_modules/next/dist/docs/` before writing code for routes, metadata, caching
(`revalidate`/`dynamic`), and config.
