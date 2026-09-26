# Redesign B6 "Svítání" — design spec

**Date:** 2026-09-26 · **Branch:** `feat/redesign-b6` · **Owner:** Pavel · **Content sign-off:** Lenka Ranšová

## 1. Why

Google Ad Grants rejected sosvyzivne.cz on 9 Jul 2026 with the generic "website policy" reason (no specific criterion named). The performance fixes (PR #17) merged only on 28 Jul, after that review. Rather than patch the Stitch design, Pavel decided on a new visual design and a new public frontend.

Direction chosen after two A/B rounds (Claude Code vs Claude Design, 12 directions): **B6 "Svítání"**. Reference mockup: `claudeos/staging/sosvyzivne/design-final/B6.html` (+ full screenshots in `…/screenshots/`). Comparison: https://claude.ai/artifact/2nFL6k2EmaAzkfdmFyjsNc.

**Success =** the site passes Ad Grants review on resubmission: within seconds a reviewer sees what we do, for whom, that it is free, that we are a registered nonprofit (nadační fond, IČO 17850983), and nothing on the site is broken, empty or placeholder. Mobile PageSpeed ≥ 90.

## 2. Scope

**In:** every public page (layout, header, footer, homepage, content pages, blog/FAQ templates, contact, intake page restyle), design tokens, fonts, imagery, the new pages in §3, the technical Ad Grants fixes in §7.

**Out:**
- Backend: Prisma schema, CMS, admin, auth, uploadthing, server actions stay as they are. The intake form's action (`chci-pomoc-s-vymahanim-vyzivneho/actions.ts`) is reused unchanged.
- Admin UI (`(admin)`, `(auth)`) keeps its current look.
- **Průvodce návrhem** (Lenka's wizard) is sub-project 2 with its own spec. Here it only gets a real explanatory page (§3), no form.

## 3. Information architecture

Nav: **Jak pomáháme · O nás · Výroční zprávy · Poradna · Podpořte nás** + CTA **Chci pomoc** (→ intake page). Phone number visible in the header on desktop and in the mobile menu.

| Route | Status | Purpose |
|---|---|---|
| `/` | rebuild | B6 homepage (sections in §5) |
| `/o-nas` | **new** | Mission (from foundation deed), story since 2019, transformation to nadační fond 2023, správní rada + revizor, team (6 people, AR 2025), partners (EÚ Plzeň-jih, Nadace Agrofert, SOS rodině s.r.o.) |
| `/jak-pomahame` | **new** hub | Five services as cards |
| `/jak-pomahame/vymahani-vyzivneho` | **new** | B6 inner page (reference mockup) |
| `/jak-pomahame/nahradni-vyzivne` | **new** | Same template |
| `/jak-pomahame/zvyseni-vyzivneho` | **new** | Same template; links to `/pruvodce` |
| `/jak-pomahame/zletili-studenti` | **new** | Same template |
| `/jak-pomahame/mediace` | **new** | Same template (Lenka is an accredited mediator) |
| `/vyrocni-zpravy` | **new** | List of years + key numbers |
| `/vyrocni-zpravy/[rok]` (2023–2025) | **new** | HTML version of each report: úvodní slovo, activities, team, donations received/given, statistics, summary of balance sheet and P&L, revizní zpráva; PDF as download |
| `/podporte-nas` | **new** | Transparent account, working **SPD QR code** (`lib/payment-qr.ts`), what gifts fund, donors list from ARs |
| `/pruvodce` | **new** | What the wizard will do, status "připravujeme", lawyer review; no form, no fake button |
| `/chci-pomoc-s-vymahanim-vyzivneho` | restyle | Intake form, same action |
| `/kalkulacka` | restyle | Same logic (`lib/calculator.ts`) |
| `/blog`, `/blog/[slug]` | restyle | Nav label stays "Poradna" for FAQ; blog shown as "Z poradny" teasers |
| `/faq`, `/faq/[slug]` | restyle | Labelled **Poradna** |
| `/kontakt` | restyle | Address, hours, data box, IČO, static map image linking to mapy.cz (no fake map box) |
| `/zasady-ochrany-osobnich-udaju` | restyle | + cookies section |
| `/hledat` | restyle | Kept as a route; no dead search button anywhere |

All service/about/report pages are static TSX with content in typed data files (`lib/content/*.ts`), not CMS entries: they change once a year and must never render empty.

## 4. Design system

Tokens replace the current `@theme` block in `app/globals.css` (Stitch aliases removed once nothing references them).

| Token | Value | Use |
|---|---|---|
| `--color-plum` | `#3B1C29` | headings, primary button, dark sections |
| `--color-plum-2` | `#5A2D3D` | hover, borders on dark |
| `--color-rose` | `#A8454D` | labels, links, accent words |
| `--color-rose-2` | `#B45658` | highlight pill (`.hl`) background |
| `--color-peach` | `#F5D7A8` | accent on dark, chips |
| `--color-cream` | `#FBF3EA` | page background |
| `--color-sand` | `#F3E5D4` | step cards, soft fills |
| `--color-ink` / `--color-ink-2` | `#2A1720` / `#6A4B55` | body text / secondary text |
| sky gradient | `#AEBBCC → #D9CBC0 → #F2D3B0 → #E5A27F → #B45658 → #6E2F40` | homepage hero only; lighter variant for inner-page heads |

- **Fonts** via `next/font/google` with `latin-ext`: **Hanken Grotesk** 400/500/600/700 (UI, headings) and **Instrument Serif** italic (accent words only). Replaces Playfair Display + Open Sans.
- **Accent rule:** at most one italic serif phrase per heading (`<Accent>`), at most one highlight pill (`.hl`) per page (the hero).
- **Radii:** 24px cards, 999px buttons/chips, 6px photo frames.
- **Contrast:** all text AA. Text on the hero gradient stays plum on the light part; cream text only on the plum/rose part.
- **Motion:** hover transitions only; no scroll animations; `prefers-reduced-motion` respected.

**Components** (new, `components/site/`): `SiteHeader` (glass pill menu, mobile sheet), `SiteFooter` (legal block with IČO/DS/seat/office/account/hours), `Button` (plum / glass / cream), `NoteChip`, `Accent`, `Highlight`, `PhotoFrame` (polaroid, rotation prop), `OrgBar` (hero bottom strip), `SectionHead`, `TopicCard`, `StepCards`, `StatTile`, `TeamGrid`, `GuideCard`, `PostCard`, `ServiceArticle` (inner-page template: head + checklist + flow + price box + FAQ + sticky side CTA), `Verify` (marker for unconfirmed claims, see §7).

## 5. Homepage sections (order as mockup)

1. Hero: note chip "Nezisková organizace · pomoc je zdarma", H1 "Výživné, na které má vaše dítě **nárok.**", sub "Pomůžeme vám ho získat.", lead, CTAs (Chci pomoc s výživným / Zavolat 602 842 888), four framed photos, **OrgBar**: SOS výživné nadační fond · IČO 17850983 · pomáháme od 2019 · odpověď do 24 h · Kancelář Kralovice · hodiny.
2. Komu pomáháme — three topic cards → service pages.
3. Jak to funguje — three steps.
4. Kdo jsme (plum) — Lenka's quote, 4 stats with source link to ARs, Lenka's portrait.
5. Náš tým — six real portraits.
6. Průvodce (připravujeme) → `/pruvodce`.
7. Z poradny — 3 latest published blog posts from CMS (ISR).
8. Podpořte nás — account + link.
9. Footer.

## 6. Content and imagery

- Copy comes from the reference mockup and `claudeos/staging/sosvyzivne/design-brief.md`. New pages (§3) are drafted from the 2023–2025 annual reports and the current site; Lenka signs off before merge.
- **Claims to verify with Lenka** (marked `<Verify>` until confirmed): arrears can be claimed "i zpětně" (limitation), "pro vás nic" / who pays exekuce costs, "vymožené platby jdou vám", help when the other parent lives abroad, "pomáháme po celé ČR".
- **Photos:** only white European people, candid/documentary, no polished agency stock (Pavel, 2026-09-26). Team and Lenka use the real portraits from AR 2025; request originals from Lenka (the PDF copies are 300–600 px). Stock: Unsplash/Pexels free licence, list in `docs/photo-credits.md`. All via `next/image` (AVIF/WebP, explicit `sizes`), hero frame 1 `priority`, frames 2–4 and everything else lazy; each source ≤ 1600 px, target ≤ 80 kB per rendered image.

## 7. Ad Grants technical requirements

| Criterion | Implementation |
|---|---|
| Domain / redirect | `www.sosvyzivne.cz` currently **302** → apex. Change to permanent (308) in the hosting domain settings. Submit the exact final URL `https://sosvyzivne.cz/` in the Ad Grants request. |
| Substantial content | New pages §3; annual reports as HTML, PDFs only as downloads. |
| Clear mission | Hero + OrgBar + `/o-nas` + footer legal block; `NGO` JSON-LD (name, IČO, address, telephone, sameAs) in the root layout. |
| No broken links / dead UI | No disabled or placeholder controls; `linkinator` crawl of `next start` in CI (`pnpm check:links`) fails on any 4xx/5xx internal link. `<Verify>` renders a visible marker in development and preview deployments (so Lenka sees what to confirm) and throws when `VERCEL_ENV === "production"`, so unconfirmed claims cannot reach the live site. |
| Speed | Marketing pages static or ISR (`revalidate = 3600`); replace `force-dynamic` on `/blog`, `/blog/[slug]`, `/faq`, `/faq/[slug]` with ISR + `generateStaticParams`. No client JS on marketing pages except mobile menu, consent banner and PostHog (after consent). Target mobile PSI ≥ 90, LCP < 2.5 s. |
| Mobile | Verified at 320, 390, 768, 1440 px; no horizontal scroll. |
| HTTPS | Already enforced; check for mixed content after deploy. |
| Donations | `/podporte-nas` with transparent account + working QR; no external donation redirects. |

Outside the website policy but needed after approval: conversion tracking (intake form submit, phone click) in Google Ads.

## 8. What gets removed

`components/home/*`, `components/layout/{Header,Footer,MobileNav,PromoRibbon,CtaBand}.tsx`, `lib/stitch-images.ts`, `public/images/stitch/*`, Playfair/Open Sans wiring — each deleted only after nothing imports it. The Stitch design docs (`docs/02`, `docs/08`) get a note pointing to this spec.

## 9. Verification

- `pnpm lint` and `pnpm build` pass.
- `pnpm check:links` passes against `next start`.
- Screenshots of every public route at 390 and 1440 px compared with the mockup.
- PageSpeed Insights (mobile + desktop) on the preview deployment: ≥ 90 mobile.
- `docs/google-ad-grants-website-checklist.md` re-run and updated with results.
- Lenka signs off copy on the preview deployment; no `<Verify>` markers left.

## 10. Rollout

Branch `feat/redesign-b6` → preview deployment → Lenka's content review → merge to `main` → production → fix www redirect → resubmit Ad Grants activation in the Google for Nonprofits account.

## 11. Open items

- Originals of team portraits + ideally 1–2 real photos from the Kralovice office (Lenka).
- Answers to the claims in §6.
- Confirm partners/donors that may be named publicly (AR 2025 lists SOS rodině s.r.o., Nadace Agrofert, Robert Müller).
