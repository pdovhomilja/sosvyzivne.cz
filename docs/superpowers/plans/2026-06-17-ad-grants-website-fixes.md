# Ad Grants Website-Policy Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all six Google Ad Grants website-policy issues found in the `sosvyzivne.cz` audit (disabled search, QR placeholder, map placeholder, slow homepage, hours discrepancy, missing privacy policy).

**Architecture:** Six independent changes to a Next.js 16 (App Router, `next-intl`, Prisma/Postgres) site. Each fix is self-contained and individually committable. Pages hardcode Czech prose (existing pattern); only nav/cta/cookies/site/auth live in `messages/cs.json`.

**Tech Stack:** Next.js 16, React 19, next-intl, Prisma 7 (`lib/db.ts`), Tailwind v4, Radix UI, `qrcode` (new dep), `tsx` (existing, for logic verification).

> **Testing note:** This repo has **no test runner** (no vitest/jest) and the project conventions do not require one. TDD is therefore adapted: the one piece of pure logic (`lib/payment-qr.ts`) is verified with a runnable `tsx` assertion snippet; routes/UI are verified with `pnpm lint`, `pnpm build`, and explicit manual checks. Do **not** scaffold a test framework — that is out of scope.

> **Before writing route/caching/metadata code** (per `AGENTS.md`): skim the relevant guide under `node_modules/next/dist/docs/` — this Next.js has breaking changes vs. training data. Especially the App Router caching guide for `revalidate`/`dynamic`.

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/[locale]/page.tsx` | Modify | Drop `force-dynamic`, use ISR |
| `lib/org.ts` | Modify | Fix Thursday hours value |
| `app/[locale]/zasady-ochrany-osobnich-udaju/page.tsx` | Create | Privacy policy page |
| `components/layout/Footer.tsx` | Modify | Footer link to privacy page |
| `app/sitemap.ts` | Modify | Add privacy route |
| `lib/payment-qr.ts` | Create | Domestic acct → IBAN → SPD string |
| `scripts/verify-payment-qr.ts` | Create | Runnable assertion check for the above |
| `app/[locale]/kontakt/page.tsx` | Modify | Render real QR + OfficeMap |
| `components/contact/OfficeMap.tsx` | Create | Consent-gated Google Maps embed |
| `lib/cms/search.ts` | Create | Search blog + FAQ |
| `app/[locale]/hledat/page.tsx` | Create | Search results page |
| `components/layout/Header.tsx` | Modify | Search button → working link |
| `components/layout/MobileNav.tsx` | Modify | Add "Hledat" entry |
| `app/robots.ts` | Modify | Disallow `/hledat` |
| `package.json` | Modify | Add `qrcode` + `@types/qrcode` |

---

## Task 1: Homepage performance (drop `force-dynamic` → ISR)

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Read the caching guide**

Skim `node_modules/next/dist/docs/` for the App Router caching / `revalidate` page to confirm the exact `revalidate` semantics in this Next.js version.

- [ ] **Step 2: Replace the dynamic directive with ISR**

In `app/[locale]/page.tsx`, change:

```tsx
export const dynamic = "force-dynamic";
```

to:

```tsx
// Revalidate hourly: the ad-landing page must be fast (PageSpeed mobile).
// Latest blog teasers refresh on the next request after 1h. DB-failure
// fallback below still renders the page without teasers.
export const revalidate = 3600;
```

Leave the existing `try/catch` around `getLatestPosts` unchanged.

- [ ] **Step 3: Verify build treats the route as static/ISR**

Run: `pnpm build`
Expected: build succeeds; in the route summary the `/[locale]` route is **not** marked `ƒ (Dynamic)` — it should be `●`/ISR (revalidate). If it stays dynamic, check for other `dynamic`/`headers()`/`cookies()` usage in child components and report back before forcing it.

- [ ] **Step 4: Lint**

Run: `pnpm lint`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "perf(home): use ISR instead of force-dynamic for faster ad-landing page"
```

---

## Task 2: Fix Thursday office-hours discrepancy

> **BLOCKER — confirm value first.** `lib/org.ts` says Thursday `08:00 – 14:00`; `docs/06` flags 14:00 vs 16:00. Get the correct closing time from the user/org before editing. If unconfirmed, skip this task and flag it; do not guess.

**Files:**
- Modify: `lib/org.ts`

- [ ] **Step 1: Set the confirmed value**

In `lib/org.ts`, update the Thursday entry and remove the stale NOTE comment. Example (replace `HH:MM` with the confirmed time):

```ts
  hours: [
    { day: "Pondělí", time: "08:00 – 16:00" },
    { day: "Čtvrtek", time: "08:00 – HH:MM" },
  ],
```

Also delete the line:

```ts
  // NOTE: docs/06 flags a Thursday-hours discrepancy (14:00 vs 16:00) to resolve.
```

- [ ] **Step 2: Verify it propagates**

Run: `pnpm build`
Expected: succeeds. Header, Footer, and `/kontakt` all read `ORG.hours`, so the value updates everywhere.

- [ ] **Step 3: Commit**

```bash
git add lib/org.ts
git commit -m "fix(org): correct Thursday office hours"
```

---

## Task 3: Privacy Policy page

**Files:**
- Create: `app/[locale]/zasady-ochrany-osobnich-udaju/page.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Create the page**

Create `app/[locale]/zasady-ochrany-osobnich-udaju/page.tsx`. Czech prose is hardcoded (matches `kontakt`/`AboutBlock` pattern); it reads `ORG` for contact details.

```tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Section } from "@/components/ui/container";
import { ORG } from "@/lib/org";

export const metadata: Metadata = {
  title: "Zásady ochrany osobních údajů – SOS výživné",
  description:
    "Jak SOS výživné nadační fond zpracovává osobní údaje, používá cookies a analytiku v souladu s GDPR.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Section>
      <div className="mx-auto max-w-3xl space-y-6 text-ink-muted leading-relaxed">
        <h1 className="font-heading text-4xl sm:text-5xl text-ink leading-tight">
          Zásady ochrany osobních údajů
        </h1>

        <p>
          Správcem osobních údajů je <strong className="text-ink">{ORG.legalName}</strong>,
          IČO: {ORG.ico}, se sídlem {ORG.seat}. V otázkách ochrany osobních údajů
          nás můžete kontaktovat na e-mailu{" "}
          <a href={`mailto:${ORG.email}`} className="text-terracotta hover:underline">
            {ORG.email}
          </a>.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Jaké údaje zpracováváme</h2>
        <p>
          Zpracováváme údaje, které nám sami poskytnete prostřednictvím
          kontaktního formuláře nebo e-mailem (zejména jméno, e-mail, telefon
          a popis vaší situace), a to výhradně za účelem poskytnutí poradenství
          a pomoci s vymáháním výživného. Právním základem je váš souhlas,
          případně plnění opatření přijatých před uzavřením smlouvy.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Cookies</h2>
        <p>
          Náš web používá nezbytné cookies nutné pro jeho fungování. S vaším
          souhlasem používáme také analytické cookies. Své předvolby můžete
          kdykoli změnit přes odkaz „Nastavení cookies“ v patičce webu.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Analytika (PostHog)</h2>
        <p>
          Pro zlepšování webu používáme nástroj PostHog. Analytické sledování se
          aktivuje až poté, co v liště cookies povolíte kategorii „Analytika“.
          Bez vašeho souhlasu se žádné analytické údaje neshromažďují.
        </p>

        <h2 className="font-heading text-2xl text-ink pt-4">Vaše práva</h2>
        <p>
          Máte právo na přístup ke svým údajům, jejich opravu nebo výmaz,
          omezení zpracování, vznesení námitky a odvolání souhlasu. Pro
          uplatnění práv nás kontaktujte na{" "}
          <a href={`mailto:${ORG.email}`} className="text-terracotta hover:underline">
            {ORG.email}
          </a>. Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních
          údajů (www.uoou.cz).
        </p>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Add footer link**

In `components/layout/Footer.tsx`, import `Link` and add a link in the bottom bar next to `CookieSettingsLink`. Add the import near the top:

```tsx
import { Link } from "@/i18n/navigation";
```

Replace the bottom-bar `Container` contents:

```tsx
        <Container className="flex flex-col items-center justify-center gap-2 text-center text-ink-muted text-sm sm:flex-row sm:gap-4">
          <span>© {new Date().getFullYear()} SOSvyzivne.cz</span>
          <Link
            href="/zasady-ochrany-osobnich-udaju"
            className="hover:text-primary transition-colors"
          >
            Zásady ochrany osobních údajů
          </Link>
          <CookieSettingsLink className="hover:text-primary transition-colors" />
        </Container>
```

- [ ] **Step 3: Add to sitemap**

In `app/sitemap.ts`, add the route to `STATIC_PATHS`:

```ts
const STATIC_PATHS = [
  "",
  "/chci-pomoc-s-vymahanim-vyzivneho",
  "/kalkulacka",
  "/faq",
  "/blog",
  "/kontakt",
  "/zasady-ochrany-osobnich-udaju",
];
```

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds; `/[locale]/zasady-ochrany-osobnich-udaju` appears in the route list.

- [ ] **Step 5: Manual check**

Run `pnpm dev`, open `/zasady-ochrany-osobnich-udaju`, and confirm the footer link navigates there.

- [ ] **Step 6: Commit**

```bash
git add app/[locale]/zasady-ochrany-osobnich-udaju/page.tsx components/layout/Footer.tsx app/sitemap.ts
git commit -m "feat(privacy): add privacy policy page with footer link and sitemap entry"
```

---

## Task 4: Real donation QR code

**Files:**
- Modify: `package.json` (add deps)
- Create: `lib/payment-qr.ts`
- Create: `scripts/verify-payment-qr.ts`
- Modify: `app/[locale]/kontakt/page.tsx`

- [ ] **Step 1: Install the QR library**

Run: `pnpm add qrcode && pnpm add -D @types/qrcode`
Expected: `qrcode` in dependencies, `@types/qrcode` in devDependencies.

- [ ] **Step 2: Create the payment-QR helper**

Create `lib/payment-qr.ts`. Converts the domestic account (`prefix-number/bank`) to a Czech IBAN and builds an SPD (Short Payment Descriptor) string, then renders an SVG QR.

```ts
import QRCode from "qrcode";

/** Convert a Czech domestic account "prefix-number/bank" to IBAN. */
export function accountToIban(account: string): string {
  const [main, bank] = account.split("/");
  if (!bank) throw new Error(`Missing bank code in account: ${account}`);
  const [prefixRaw, numberRaw] = main.includes("-")
    ? main.split("-")
    : ["0", main];
  const prefix = prefixRaw.padStart(6, "0");
  const number = numberRaw.padStart(10, "0");
  const bankCode = bank.padStart(4, "0");
  const bban = `${bankCode}${prefix}${number}`; // 20 digits

  // mod-97 over (bban + "CZ00"), letters → numbers (C=12, Z=35)
  const rearranged = `${bban}123500`; // CZ -> 1235, "00" check placeholder
  const checkNum = 98 - mod97(rearranged);
  const check = checkNum.toString().padStart(2, "0");
  return `CZ${check}${bban}`;
}

/** Build a SPD (spayd) string for a donation, no fixed amount. */
export function buildSpd(account: string, message: string): string {
  const iban = accountToIban(account);
  return `SPD*1.0*ACC:${iban}*CC:CZK*MSG:${message}`;
}

/** Render the donation QR as an inline SVG string (server-side). */
export async function donationQrSvg(
  account: string,
  message: string,
): Promise<string> {
  const spd = buildSpd(account, message);
  return QRCode.toString(spd, { type: "svg", margin: 1, width: 160 });
}

/** Validate an IBAN via mod-97 (returns true if checksum == 1). */
export function isValidIban(iban: string): boolean {
  const moved = iban.slice(4) + iban.slice(0, 4);
  const numeric = moved
    .split("")
    .map((c) => (/[A-Z]/.test(c) ? (c.charCodeAt(0) - 55).toString() : c))
    .join("");
  return mod97(numeric) === 1;
}

function mod97(numeric: string): number {
  let remainder = 0;
  for (const ch of numeric) {
    remainder = (remainder * 10 + Number(ch)) % 97;
  }
  return remainder;
}
```

- [ ] **Step 3: Create the verification script**

Create `scripts/verify-payment-qr.ts`:

```ts
import { accountToIban, buildSpd, isValidIban } from "@/lib/payment-qr";
import { ORG } from "@/lib/org";

const iban = accountToIban(ORG.donationAccount);
console.log("Account:", ORG.donationAccount);
console.log("IBAN:   ", iban);
console.log("SPD:    ", buildSpd(ORG.donationAccount, "Dar SOS vyzivne"));

if (iban.length !== 24) throw new Error(`IBAN length != 24: ${iban}`);
if (!iban.startsWith("CZ")) throw new Error(`IBAN not CZ: ${iban}`);
if (!isValidIban(iban)) throw new Error(`IBAN failed mod-97 check: ${iban}`);

console.log("✓ IBAN is structurally valid (mod-97 == 1)");
```

- [ ] **Step 4: Run the verification**

Run: `pnpm tsx scripts/verify-payment-qr.ts`
Expected: prints the IBAN (24 chars, starts `CZ`) and SPD string, ends with `✓ IBAN is structurally valid`. If it throws, fix `lib/payment-qr.ts` before continuing.

- [ ] **Step 5: Render the QR on the contact page**

In `app/[locale]/kontakt/page.tsx`:

Add the import:

```tsx
import { donationQrSvg } from "@/lib/payment-qr";
```

Inside the component, before the `return`, build the QR:

```tsx
  const qrSvg = await donationQrSvg(ORG.donationAccount, "Dar SOS vyzivne");
```

Replace the QR placeholder block (the `<div ... aria-label="QR kód pro platbu">…</div>`) with:

```tsx
            <div
              className="w-40 h-40 shrink-0 rounded-lg bg-white border border-hairline p-2 flex items-center justify-center"
              role="img"
              aria-label="QR kód pro platbu na účet nadačního fondu"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
```

Leave the adjacent explanatory paragraph as-is.

- [ ] **Step 6: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds.

- [ ] **Step 7: Manual check**

Run `pnpm dev`, open `/kontakt`, scan the QR with a Czech banking app, and confirm it prefills a payment to the fund's account.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml lib/payment-qr.ts scripts/verify-payment-qr.ts app/[locale]/kontakt/page.tsx
git commit -m "feat(donation): render real SPD payment QR on contact page"
```

---

## Task 5: Consent-gated Google Maps embed

**Files:**
- Create: `components/contact/OfficeMap.tsx`
- Modify: `app/[locale]/kontakt/page.tsx`

- [ ] **Step 1: Create the OfficeMap component**

Create `components/contact/OfficeMap.tsx`. Click-to-load: shows a button by default; loads the Google Maps iframe only after the user clicks, so Google cookies don't load before consent.

```tsx
"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";

export function OfficeMap({ query, label }: { query: string; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  if (loaded) {
    return (
      <iframe
        title={`Mapa – ${label}`}
        src={src}
        className="h-56 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="h-56 w-full flex flex-col items-center justify-center gap-3 text-ink-muted hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <MapPin size={32} className="text-terracotta" aria-hidden="true" />
      <span className="text-sm font-medium">Zobrazit mapu — {label}</span>
      <span className="text-xs">Načtením mapy souhlasíte s cookies Google Maps</span>
    </button>
  );
}
```

- [ ] **Step 2: Use it on the contact page**

In `app/[locale]/kontakt/page.tsx`:

Add the import:

```tsx
import { OfficeMap } from "@/components/contact/OfficeMap";
```

Replace the map placeholder block (the `<div className="mt-6 ... overflow-hidden">` containing the `MapPin` placeholder) with:

```tsx
        <div className="mt-6 rounded-xl bg-surface-subtle border border-hairline overflow-hidden">
          <OfficeMap query={ORG.office} label="Kancelář Kralovice" />
        </div>
```

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds.

- [ ] **Step 4: Manual check**

Run `pnpm dev`, open `/kontakt`: confirm the map area shows the "Zobrazit mapu" button, no Google network request fires until clicked (check DevTools Network), and the map loads on click.

- [ ] **Step 5: Commit**

```bash
git add components/contact/OfficeMap.tsx app/[locale]/kontakt/page.tsx
git commit -m "feat(contact): consent-gated Google Maps embed for office location"
```

---

## Task 6: Working site search (blog + FAQ)

**Files:**
- Create: `lib/cms/search.ts`
- Create: `app/[locale]/hledat/page.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/MobileNav.tsx`
- Modify: `app/robots.ts`

- [ ] **Step 1: Create the search query module**

Create `lib/cms/search.ts`. Case-insensitive match on title/body across published blog posts + FAQ.

```ts
import db from "@/lib/db";

export type SearchResult = {
  id: string;
  type: "BLOG_POST" | "FAQ";
  slug: string;
  title: string;
  excerpt: string | null;
  href: string;
};

export async function searchContent(
  locale: string,
  query: string,
): Promise<SearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await db.content.findMany({
    where: {
      locale,
      status: "PUBLISHED",
      type: { in: ["BLOG_POST", "FAQ"] },
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 30,
    select: { id: true, type: true, slug: true, title: true, excerpt: true },
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type as "BLOG_POST" | "FAQ",
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    href: r.type === "FAQ" ? `/faq/${r.slug}` : `/blog/${r.slug}`,
  }));
}
```

- [ ] **Step 2: Create the search results page**

Create `app/[locale]/hledat/page.tsx`. A GET form + results; DB-failure safe.

```tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { searchContent, type SearchResult } from "@/lib/cms/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hledání – SOS výživné",
  description: "Prohledejte články a často kladené dotazy na webu SOS výživné.",
  robots: { index: false },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  const query = (q ?? "").trim();

  let results: SearchResult[] = [];
  if (query.length >= 2) {
    try {
      results = await searchContent(locale, query);
    } catch {
      // DB not connected — show empty results.
    }
  }

  return (
    <Section>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl sm:text-5xl text-ink leading-tight">
          Hledání
        </h1>

        <form action="/hledat" method="get" className="mt-6 flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Zadejte hledaný výraz…"
            aria-label="Hledaný výraz"
            className="flex-1 rounded-md border border-hairline bg-white px-4 h-11 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary text-white px-5 h-11 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Search size={18} aria-hidden />
            Hledat
          </button>
        </form>

        <div className="mt-10 space-y-6">
          {query.length < 2 ? (
            <p className="text-ink-muted">Zadejte alespoň dva znaky.</p>
          ) : results.length === 0 ? (
            <p className="text-ink-muted">
              Pro výraz „{query}“ jsme nic nenašli. Zkuste jiný výraz.
            </p>
          ) : (
            results.map((r) => (
              <article key={r.id} className="border-b border-hairline pb-6">
                <span className="text-xs font-semibold uppercase text-terracotta">
                  {r.type === "FAQ" ? "Dotaz" : "Článek"}
                </span>
                <h2 className="font-heading text-xl text-ink mt-1">
                  <Link
                    href={r.href}
                    className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    {r.title}
                  </Link>
                </h2>
                {r.excerpt && (
                  <p className="text-sm text-ink-muted leading-relaxed line-clamp-2 mt-2">
                    {r.excerpt}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 3: Make the Header search button functional**

In `components/layout/Header.tsx`, replace the disabled search `<button>` block with a `Link` (the `Link` import from `@/i18n/navigation` already exists):

```tsx
            {/* Search – links to the search page */}
            <Link
              href="/hledat"
              aria-label="Hledat"
              className="hidden items-center justify-center rounded-md p-2 text-ink-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:inline-flex"
            >
              <Search size={18} aria-hidden />
            </Link>
```

- [ ] **Step 4: Add search to the mobile menu**

In `components/layout/MobileNav.tsx`, add a "Hledat" link at the top of the `<nav>` list:

```tsx
          <nav className="flex flex-col gap-4 text-lg">
            <Link href="/hledat" className="text-ink hover:text-accent" onClick={() => setOpen(false)}>
              Hledat
            </Link>
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="text-ink hover:text-accent" onClick={() => setOpen(false)}>
                {it.label}
              </Link>
            ))}
          </nav>
```

- [ ] **Step 5: Keep search results out of the index**

In `app/robots.ts`, add `/hledat` to `disallow`:

```ts
      disallow: ["/dashboard", "/content", "/users", "/media", "/login", "/hledat"],
```

- [ ] **Step 6: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds; `/[locale]/hledat` appears in the route list.

- [ ] **Step 7: Manual check**

Run `pnpm dev`: click the header search icon → lands on `/hledat`; type a term present in a published post/FAQ → results show with correct links and type badges; empty term shows the "two characters" hint; nonsense term shows the "nic nenašli" message. Confirm the mobile menu "Hledat" entry works.

- [ ] **Step 8: Commit**

```bash
git add lib/cms/search.ts app/[locale]/hledat/page.tsx components/layout/Header.tsx components/layout/MobileNav.tsx app/robots.ts
git commit -m "feat(search): add working blog + FAQ site search, replace disabled button"
```

---

## Final verification (after all tasks)

- [ ] `pnpm lint && pnpm build` clean.
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) on the homepage — note the **mobile** score (Task 1 should have improved it).
- [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly).
- [ ] Broken-link sweep across the site.
- [ ] Confirm production serves all pages over HTTPS with no mixed-content warnings (the QR is inline SVG and the map is consent-gated, so no third-party assets load unprompted).
- [ ] Re-read `docs/google-ad-grants-website-checklist.md` and tick off each item.

## Self-review notes (coverage)
- Spec §1 search → Task 6. §2 QR → Task 4. §3 map → Task 5. §4 homepage perf → Task 1. §5 hours → Task 2. §6 privacy → Task 3.
- Function names consistent: `accountToIban` / `buildSpd` / `donationQrSvg` / `isValidIban` (Task 4), `searchContent` / `SearchResult` (Task 6), `OfficeMap` (Task 5).
- No test framework introduced (intentional — see Testing note).
