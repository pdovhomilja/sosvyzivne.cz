# 05 — Next.js Architecture (build spec)

> **Read first:** `AGENTS.md` says this repo pins a Next.js version whose APIs/conventions may differ
> from common knowledge. Before implementing, read the relevant guides in
> `node_modules/next/dist/docs/`. The structure below uses the App Router model; adapt names/APIs to
> whatever the installed version documents (routing files, data fetching, server actions, metadata,
> image, font). Treat this as intent, not copy-paste.

> **Stack decision (2026-06-13):** adopt the **aqunama.com-v2** blueprint verbatim — Next.js 16 +
> Prisma/PostgreSQL + better-auth (email-OTP) admin + next-intl + Tailwind v4. The generic
> recommendations below still hold; the concrete, chosen stack and the admin/CMS architecture are
> documented in **[`07-techstack-and-architecture.md`](./07-techstack-and-architecture.md)**. Where
> this file and `07` differ, `07` wins (it reflects a real, working codebase).

## Stack recommendation

| Concern | Choice | Why |
|---------|--------|-----|
| Framework | Next.js (App Router) | Already the project base |
| Rendering | Mostly **static (SSG/ISR)** | Marketing + content site; fast, cheap, SEO-friendly |
| Styling | Tailwind + CSS variables (tokens from `02`) | Fast, consistent, themeable |
| Content | **DB-backed CMS** (Prisma/Postgres + admin panel) — see `07` | Decision: adopt the aqunama blueprint so staff edit blog/FAQ in-app (supersedes the earlier MDX-first idea) |
| Fonts | `next/font/google` — Playfair Display + Open Sans | No CLS, self-hosted |
| Images | `next/image` (WebP/AVIF) | Perf + responsive |
| Forms | Server Action or Route Handler + email (Resend) | No backend DB needed for leads |
| Validation | Zod (shared client/server schema) | Type-safe form + calculator |
| i18n | Single locale `cs` now; structure for future | Czech-only today |
| Analytics | Plausible / GA4 + consent banner | CZ/EU privacy compliance |
| Map | Static map image or embed (lazy) | Avoid heavy Google JS |

## Proposed route tree (App Router)

```
app/
├─ layout.tsx                # html lang="cs", fonts, <Header/> <Footer/> <CtaBand/>, JSON-LD Organization
├─ page.tsx                  # Home (sections from /components/home/*)
├─ globals.css               # tokens + Tailwind
│
├─ chci-pomoc-s-vymahanim-vyzivneho/
│  └─ page.tsx               # lead form (client form + server action)
│
├─ kalkulacka/
│  └─ page.tsx               # calculator (client component)
│
├─ faq/
│  ├─ page.tsx               # FAQ hub (list/accordion) + FAQPage JSON-LD
│  └─ [slug]/page.tsx        # individual answer (if kept as pages)
│
├─ blog/
│  ├─ page.tsx               # listing (paginated)
│  ├─ strana/[page]/page.tsx # pagination (or searchParams ?page=)
│  └─ [slug]/page.tsx        # article (MDX) + Article JSON-LD
│
├─ kontakt/
│  └─ page.tsx               # donations + contact (rename concept: "Podpořte / Kontakt")
│
├─ autor/[slug]/page.tsx     # author archive (clean slugs)
│
├─ api/ (or server actions)
│  └─ lead/route.ts          # POST handler: validate → email → respond
│
├─ sitemap.ts                # generated from content
├─ robots.ts
└─ not-found.tsx

content/                     # MDX source (if file-based)
├─ blog/*.mdx
└─ faq/*.mdx

components/
├─ layout/ Header, TopBar, Footer, CtaBand, MobileNav
├─ home/ Hero, AboutSection, AudienceCards, StepsSection, BlogTeasers, MediaStrip, Testimonials, ContactBlock
├─ ui/ Button, Card, Input, Field, Accordion, Badge, Prose, StarRating, Container, Section
├─ forms/ LeadForm
└─ calculator/ AlimonyCalculator

lib/
├─ content.ts                # MDX/CMS readers (getPosts, getPost, getFaqs)
├─ calculator.ts             # pure calc fn + table
├─ schemas.ts                # Zod schemas (lead, calculator)
├─ org.ts                    # single source of truth for org/contact constants
└─ seo.ts                    # metadata helpers, JSON-LD builders
```

## Content model

### Org constants (`lib/org.ts`)
Centralize so footer/header/contact/JSON-LD never drift:
```ts
export const ORG = {
  legalName: "SOS výživné nadační fond",
  ico: "17850983",
  dataBox: "xg9bbex",
  seat: "Žihle 232, 331 65 Žihle",
  office: "Masarykovo nám. 1, 331 41 Kralovice",
  email: "info@sosvyzivne.cz",
  phone: "+420602842888",
  phoneDisplay: "+420 602 842 888",
  facebook: "https://www.facebook.com/SOSvyzivne",
  donationAccount: "131-1390040247/0100",
  contactPerson: "PhDr. Lenka Ranšová, DiS.",
  hours: { mon: "08:00–16:00", thu: "08:00–14:00" }, // resolve Thu discrepancy
} as const;
```

### Article / FAQ frontmatter (MDX)
```yaml
---
title: "Náhradní výživné – pomoc proti neplatičům"
slug: "nahradni-vyzivne-pomoc-proti-neplaticum"
type: "blog" | "faq"
excerpt: "Od 1. července 2021 je možné zažádat o náhradní výživné…"
author: "jan-ruzicka"
publishedAt: "2021-06-21"
updatedAt: "2026-03-01"
category: "Náhradní výživné"
ogImage: "/img/…"
---
```

Authors as a small map (`lib/authors.ts`): clean slug → { name, bio?, photo? }.

## Lead form (the money path)

- Shared **Zod schema** (`lib/schemas.ts`): `jmeno` (required), `email` (email), `telefon`
  (CZ phone, optional but recommended), `psc` (5-digit), `zprava` (optional), `souhlas` (must be true),
  plus a honeypot field that must be empty.
- Client: progressive enhancement — works without JS via the server action; with JS show inline
  validation + success/error UI.
- Server: re-validate, rate-limit by IP, send email via Resend (to `info@sosvyzivne.cz`),
  optionally push to a CRM/Google Sheet. Return typed result.
- **GDPR:** consent checkbox + link to privacy policy. Store nothing you don't need.
- Spam: honeypot + time-trap + (optional) Turnstile/hCaptcha.

## Alimony calculator (`lib/calculator.ts`)

The site states the calc "vychází z doporučujících tabulek Ministerstva spravedlnosti ČR". The
**actual legacy implementation** (recovered verbatim from the live page's inline JS, script index 20,
on 2026-06-13) is much simpler than the official table: a flat **percentage of net income per child
by age bracket**, summed, with **no sibling-reduction factor**, no income cap, and no per-child
breakdown. Age is picked from a `<select>` whose option `value` *is* the percentage.

### Exact legacy logic (source of truth — port 1:1 to match results)

| Age bracket (option label) | `value` (× net income) | = % |
|----------------------------|------------------------|-----|
| `0-5 let`        | `0.11` | 11% |
| `6-9 let`        | `0.13` | 13% |
| `10-14 let`      | `0.15` | 15% |
| `15-17 let`      | `0.17` | 17% |
| `18 a více let`  | `0.19` | 19% |

```js
// Verbatim legacy core (vanilla JS, Elementor HTML widget):
function calculateAliment() {
  const income = parseFloat(document.getElementById('income').value);
  if (isNaN(income) || income <= 0) { alert('Zadejte platný příjem.'); return; }
  const selects = document.querySelectorAll('#children-wrapper select');
  let total = 0;
  selects.forEach(sel => { total += income * parseFloat(sel.value); });
  // output: `Celkové doporučené výživné: ${Math.round(total)} Kč`
}
// addChild() appends a <select> with the 5 options above; removeChild(id) removes a row.
```

### Faithful Next.js port (`lib/calculator.ts`)

```ts
// Brackets mirror the legacy <select> options exactly. Keep value === percentage.
export const AGE_BRACKETS = [
  { value: 0.11, label: "0-5 let" },
  { value: 0.13, label: "6-9 let" },
  { value: 0.15, label: "10-14 let" },
  { value: 0.17, label: "15-17 let" },
  { value: 0.19, label: "18 a více let" },
] as const;

/** children = array of selected bracket percentages (e.g. [0.11, 0.17]). */
export function estimateSupport(netIncome: number, children: number[]) {
  if (!Number.isFinite(netIncome) || netIncome <= 0) {
    return { ok: false as const, error: "Zadejte platný příjem." };
  }
  const perChild = children.map((pct) => netIncome * pct); // unrounded
  const total = Math.round(perChild.reduce((a, b) => a + b, 0));
  return { ok: true as const, perChild: perChild.map(Math.round), total };
}
```

> Behavioral parity notes: legacy **rounds only the final total** (`Math.round` on the sum), so round
> the total — not each child — to reproduce identical results. Legacy shows only the grand total
> ("Celkové doporučené výživné: X Kč"); the redesign *may* additionally show a per-child breakdown as
> an enhancement, but the headline number must equal the rounded sum. Legacy uses an `alert()` for the
> empty/invalid income — replace with inline field validation.

Always render the disclaimer with the result and a CTA to the lead form.

## Rendering & data strategy

- Home, FAQ, blog list, articles, kontakt → **static** (`generateStaticParams` for `[slug]`).
- Blog "latest 3" on home → read at build; re-deploy or ISR (`revalidate`) when content changes.
- Calculator & lead form → **client islands** within static pages.
- No database required at launch (content in MDX, leads via email). Add a CMS only if non-technical
  staff must edit content.

## Internationalization

Czech-only today. Don't over-build, but: keep all UI strings in one `cs` dictionary
(`lib/dictionary/cs.ts`) and avoid hardcoding copy in components, so adding a locale later is a
config change, not a rewrite. `<html lang="cs">`, `og:locale=cs_CZ`.

## SEO & structured data

- Per-page `metadata` (title, description, canonical, OG/Twitter) via a `seo.ts` helper.
- JSON-LD: `Organization` (sitewide, with logo/contact), `WebSite` + `SearchAction`,
  `FAQPage` on `/faq/`, `Article`/`BlogPosting` on posts, `BreadcrumbList`.
- `sitemap.ts` + `robots.ts` generated from content.
- Preserve legacy URLs via redirects (see `06`).

## Performance budget

- LCP < 2.0s on 4G mobile; fonts via `next/font` (no FOUT); hero image `priority`.
- Lazy-load below-the-fold (testimonials, map). Map = static image until interaction.
- Ship JS only for islands (form, calculator, nav drawer). Keep the rest server-rendered.
- Images: `next/image`, AVIF/WebP, explicit sizes, blur placeholders.

## Testing

- Unit: `estimateSupport` (golden cases vs legacy tool), Zod schemas.
- Integration: lead form submit (happy + invalid + honeypot), calculator interactions.
- a11y: axe on each template; keyboard nav of header drawer, form, accordion.
- Visual/manual: compare against `04-page-templates.md` wireframes and the design tokens.
