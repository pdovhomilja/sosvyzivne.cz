# Stitch Redesign Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Google Stitch designs into the existing Next.js 16 app across all 7 screens, restyling markup only while preserving every existing behavior (i18n, CMS data, forms, calculator, SEO, JSON-LD).

**Architecture:** Chrome (`Header`/`PromoRibbon`/`CtaBand`/`Footer`) stays global in `app/[locale]/layout.tsx`. Each route's page keeps its data fetching, `metadata`, and `force-dynamic`; only the returned JSX is replaced with the Stitch structure. The Home page is decomposed into single-purpose section components under `components/home/`. Stitch's Tailwind-CDN/Google-Fonts/Material-Symbols are dropped — the app's `@theme` tokens + next/font already cover them; we add the Stitch color/radius aliases so ported classes resolve unchanged, and swap Material Symbols for lucide-react.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind v4 (`@theme` in `app/globals.css`), next-intl v4, lucide-react, Radix Dialog, next/font, next/image, CVA buttons.

**Spec:** `docs/superpowers/specs/2026-06-13-stitch-redesign-port-design.md`

---

## Porting Recipe (apply in EVERY page/component task below)

When a task says "port section X from `.stitch-export/<file>.html`", do exactly this:

1. **Read** the named source file (and the line range given) to get the literal markup.
2. **Strip** `<head>`, `<script>`, `tailwind.config`, Google-Fonts `<link>`s, and the
   `<style>` block. Keep only body markup.
3. **Class names resolve as-is** because Task 1 adds the Stitch aliases to `@theme`. Do NOT
   rename classes. Exceptions: `font-headline`→`font-heading`, `font-label`→`font-body`.
4. **Icons:** replace `<span class="material-symbols-outlined">name</span>` with the lucide
   component per this map, `import`ed from `lucide-react`, sized via `className`/`size`,
   `aria-hidden` when decorative:
   `add`→`Plus`, `arrow_forward`→`ArrowRight`, `calendar_today`→`Calendar`, `call`→`Phone`,
   `check_circle`→`CheckCircle2`, `chevron_left`→`ChevronLeft`, `chevron_right`→`ChevronRight`,
   `close`→`X`, `download`→`Download`, `edit`→`Pencil`, `expand_more`→`ChevronDown`,
   `favorite`→`Heart`, `fingerprint`→`Fingerprint`, `info`→`Info`, `location_on`→`MapPin`,
   `mail`→`Mail`, `menu`→`Menu`, `photo_camera`→`Camera`, `schedule`→`Clock`, `search`→`Search`,
   `share`→`Share2`, `star`→`Star`, `sync`→`RefreshCw`, `face_nod`→use the avatar `<Image>`/`UserRound`.
5. **Links:** every `<a href="/...">` that targets an internal route becomes
   `<Link href="...">` from `@/i18n/navigation`. External (`mailto:`, `tel:`, Facebook) stay `<a>`.
6. **Images:** replace each `<img src="https://lh3...">` with `next/image`. Look up the local
   file + alt in `public/images/stitch/manifest.json` (keyed by source file, in document order).
   Use `<Image src="/images/stitch/<file>" alt="<alt>" width={W} height={H} className="...object-cover" />`
   keeping the original wrapper/aspect classes. For full-bleed blocks use `fill` + a relative
   aspect container.
7. **Contact/org values** (phone, email, hours, IČO, address, account, person, Facebook) come
   from `ORG` in `@/lib/org` — never hardcode them.
8. **Czech copy** stays inline in JSX, copied verbatim from the Stitch markup.
9. **Convert HTML attrs to JSX:** `class`→`className`, `for`→`htmlFor`, self-close voids,
   `style="..."`→`style={{...}}`, boolean attrs.

**Per-task verification (unless noted):**
- `pnpm lint` → no errors.
- `pnpm exec tsc --noEmit` → no type errors.
- Note: there is no unit-test runner for this visual work; correctness is verified by
  lint + typecheck + the dev render/visual-compare in Task 16. Logic files are NOT modified,
  so existing behavior is preserved by construction.

---

## Task 0: Create working branch

**Files:** none (git only)

- [ ] **Step 1: Branch off main**

```bash
cd /Users/pdovhomilja/development/Next.js/sosvyzivne.cz
git checkout -b feat/stitch-redesign
```

- [ ] **Step 2: Stage the already-produced assets so they travel with the work**

```bash
git add public/images/stitch docs/superpowers
git status
```
Expected: `public/images/stitch/*` (20 jpgs + manifest.json) and the spec/plan staged.
Do NOT commit yet — the first real commit lands with Task 1.

---

## Task 1: Add Stitch token aliases to the theme

**Files:**
- Modify: `app/globals.css` (the `@theme` block, ~lines 6-38)

- [ ] **Step 1: Add alias tokens inside `@theme`**

Insert these lines into the existing `@theme { … }` block (after the existing Brand/Neutrals,
before `/* Shape */`). Keep all existing tokens untouched.

```css
  /* Stitch alias names (same hexes as above) so ported markup resolves 1:1 */
  --color-peach: #f8c0ba;
  --color-peach-light: #fdebe9;
  --color-terracotta: #cd625d;
  --color-hairline: #ece2df;
  --color-surface-subtle: #fbf7f6;

  /* Stitch radii */
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
```

- [ ] **Step 2: Add the `font-headline`/`font-body` utility mapping**

Tailwind v4 exposes `--font-*` theme keys as `font-*` utilities. Add inside `@theme`:

```css
  --font-headline: var(--font-playfair), Georgia, serif;
  /* `font-body` already maps via --font-body */
```

- [ ] **Step 3: Verify utilities compile**

```bash
pnpm lint
```
Expected: no errors. (Token classes like `bg-peach-light`, `text-terracotta`, `rounded-xl`,
`font-headline` are now valid.)

- [ ] **Step 4: Commit**

```bash
git add app/globals.css public/images/stitch docs/superpowers
git commit -m "feat(design): add Stitch token aliases + commit design assets and spec/plan"
```

---

## Task 2: Image lookup helper

**Files:**
- Create: `lib/stitch-images.ts`

- [ ] **Step 1: Create a typed accessor over the manifest**

```ts
import manifest from "@/public/images/stitch/manifest.json";

export type StitchImage = {
  file: string;
  alt: string;
  data_alt: string;
  url: string;
};

type Manifest = Record<string, StitchImage[]>;

const data = manifest as Manifest;

/** Public path for a manifest entry, e.g. "/images/stitch/home-01-xxxx.jpg". */
export function imgSrc(entry: StitchImage): string {
  return `/images/stitch/${entry.file}`;
}

/** All image entries for a Stitch page, in document order. */
export function pageImages(page: keyof Manifest | string): StitchImage[] {
  return data[page] ?? [];
}

/** Best alt text: explicit alt, else a trimmed data_alt, else empty. */
export function altText(entry: StitchImage | undefined): string {
  if (!entry) return "";
  return entry.alt || entry.data_alt || "";
}
```

- [ ] **Step 2: Confirm JSON import is allowed**

Check `tsconfig.json` has `"resolveJsonModule": true` (Next defaults include it). If absent, add it.

```bash
grep -q resolveJsonModule tsconfig.json && echo OK || echo "ADD resolveJsonModule:true"
```
If it prints `ADD…`, add `"resolveJsonModule": true` under `compilerOptions`.

- [ ] **Step 3: Verify**

```bash
pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/stitch-images.ts tsconfig.json
git commit -m "feat(images): add Stitch image manifest helper"
```

---

## Task 3: Mobile nav drawer (client)

**Files:**
- Create: `components/layout/MobileNav.tsx`

- [ ] **Step 1: Build the Radix Dialog drawer**

```tsx
"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Item = { href: string; label: string };

export function MobileNav({
  items,
  calculatorLabel,
  getHelpLabel,
}: {
  items: Item[];
  calculatorLabel: string;
  getHelpLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Otevřít menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <Menu aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 bg-surface p-6 shadow-xl focus:outline-none">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-lg text-accent">Menu</Dialog.Title>
            <Dialog.Close
              aria-label="Zavřít menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X aria-hidden />
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-4 text-lg">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="text-ink hover:text-accent" onClick={() => setOpen(false)}>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/kalkulacka" onClick={() => setOpen(false)}>{calculatorLabel}</Link>
            </Button>
            <Button asChild>
              <Link href="/chci-pomoc-s-vymahanim-vyzivneho" onClick={() => setOpen(false)}>{getHelpLabel}</Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm lint && pnpm exec tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/MobileNav.tsx
git commit -m "feat(layout): add mobile nav drawer"
```

---

## Task 4: Header restyle (sticky chrome + utility bar)

**Files:**
- Modify: `components/layout/Header.tsx`
- Reference: `.stitch-export/home.html` (header + utility bar, ~lines 60-120)

- [ ] **Step 1: Rewrite Header following the Porting Recipe**

Keep it a server component using `getTranslations("nav")` and `ORG`. Structure:
- Utility bar: `bg-terracotta text-white` (== current `bg-accent`), with `ORG.email` (Mail icon),
  `ORG.phoneDisplay` (Phone icon), "Pracovní doba" text, Facebook link (`ORG.facebook`).
- Sticky main bar: `sticky top-0 z-30 bg-surface border-b border-hairline`. Logo `Link href="/"`
  (`ORG.shortName`), desktop `nav` (hidden below md) with the four `t(...)` links, a decorative
  `Search` icon button (`aria-label="Hledat"`, `disabled`, documented as non-functional), an
  outline `Kalkulačka výživné` button, the pink pill `Chci pomoc` button, and `<MobileNav>` for mobile.
- Pass `items`, `calculatorLabel={t("calculator")}`, `getHelpLabel={t("getHelp")}` to `<MobileNav>`.

Nav items array (label via `t`):
```tsx
const items = [
  { href: "/", label: t("about") },
  { href: "/faq", label: t("faq") },
  { href: "/blog", label: t("blog") },
  { href: "/kontakt", label: t("support") },
];
```

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit` → no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat(layout): restyle header to Stitch design with mobile drawer"
```

---

## Task 5: Promo ribbon (client, home only)

**Files:**
- Create: `components/layout/PromoRibbon.tsx`
- Reference: `.stitch-export/home.html` (promo ribbon, near top of body)

- [ ] **Step 1: Build dismissible ribbon**

```tsx
"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function PromoRibbon() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-peach-light text-ink">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-center gap-3 px-4 py-2 text-sm">
        <Link href="/kontakt" className="text-accent hover:underline">
          Stát uhradí za neplatiče výživné → více informací
        </Link>
        <button
          aria-label="Zavřít upozornění"
          onClick={() => setOpen(false)}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add components/layout/PromoRibbon.tsx
git commit -m "feat(layout): add dismissible promo ribbon"
```

---

## Task 6: CtaBand + Footer restyle

**Files:**
- Modify: `components/layout/CtaBand.tsx`, `components/layout/Footer.tsx`
- Reference: `.stitch-export/home.html` (CTA band + footer, bottom of body)

- [ ] **Step 1: Restyle CtaBand** — keep `getTranslations("cta")` and the `Link` target
  `/chci-pomoc-s-vymahanim-vyzivneho`. Apply the Stitch band markup (soft pink/peach background,
  centered serif headline `t("title")`, subtext `t("tagline")`, pink pill button `t("title")`).

- [ ] **Step 2: Restyle Footer** — keep all values from `ORG`. Columns: brand (logo `ORG.shortName`
  + `ORG.tagline`), Kontakt (`ORG.email`, `ORG.phoneDisplay`, hours from `ORG.hours`), Adresa
  (`ORG.legalName`, `IČO: ORG.ico`, `ORG.seat`, datová schránka `ORG.dataBox`). Bottom bar:
  `© {new Date().getFullYear()} SOSvyzivne.cz`. Match Stitch footer layout/classes.

- [ ] **Step 3: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add components/layout/CtaBand.tsx components/layout/Footer.tsx
git commit -m "feat(layout): restyle CTA band and footer to Stitch design"
```

---

## Task 7: Wire PromoRibbon into the layout

**Files:**
- Modify: `app/[locale]/layout.tsx`

- [ ] **Step 1:** The promo ribbon is home-only per spec, but it sits above the header visually.
  Render it inside the Home page (Task 9) rather than the global layout, so leave `layout.tsx`'s
  `<Header />`/`<main>`/`<CtaBand />`/`<Footer />` order unchanged. **No code change needed** —
  confirm by re-reading the layout. (This task is a checkpoint to prevent accidentally globalizing
  the ribbon.)

- [ ] **Step 2:** Verify the app still renders.

```bash
pnpm exec tsc --noEmit
```
Expected: no errors. No commit (no change).

---

## Task 8: Home section components

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/AboutBlock.tsx`,
  `components/home/AudienceCards.tsx`, `components/home/Steps.tsx`,
  `components/home/BlogTeasers.tsx`, `components/home/MediaStrip.tsx`,
  `components/home/Testimonials.tsx`
- Reference: `.stitch-export/home.html` (each section, in order) + `manifest.json` key `"home"` (8 images)

Each component is a server component (no client state) unless noted. Follow the Porting Recipe.

- [ ] **Step 1: `Hero.tsx`** — full-bleed warm photo (`home` image index 0) behind/beside centered
  serif H1 "Nečekejte! Získejte výživné, na které mají vaše děti nárok.", sub-line, pink pill
  `Link href="#jak"` "Jak začít?". Use `next/image` (`fill` + aspect wrapper for full-bleed).

- [ ] **Step 2: `AboutBlock.tsx`** — H2 "O nás", two-column rich text + rounded photo (`home` img),
  two outline buttons "Výroční zpráva 2023" / "Výroční zpráva 2024" (`<a>` to `#` placeholders;
  documented — real PDFs later).

- [ ] **Step 3: `AudienceCards.tsx`** — H2 "Mám nárok na vaši službu?", 3 cards (photo + title + text):
  "Rodič samoživitel/ka", "Rozvedený/á", "Plnoletý student". Copy text verbatim from Stitch.

- [ ] **Step 4: `Steps.tsx`** — wrapper `<div id="jak" className="scroll-mt-24">`, peach-tint section,
  H2 "Jak postupovat?", 3 numbered steps ("Rozsudek o výživném", "Podepíšete plnou moc",
  "Vše ostatní zařídíme my"), pink pill "Chci pomoc" → `/chci-pomoc-s-vymahanim-vyzivneho`.

- [ ] **Step 5: `BlogTeasers.tsx`** — accepts `posts` prop (the `getLatestPosts` result). Renders the
  Stitch 3-card layout (thumbnail, title, excerpt, "Celý článek »") + "Zobrazit vše" → `/blog`.
  Returns `null` when `posts.length === 0`. Card thumbnail: post image if the model has one, else a
  `home`/`blog` manifest placeholder by index.

```tsx
// signature
export function BlogTeasers({ posts }: { posts: { id: string; slug: string; title: string; excerpt: string | null }[] }) { /* ... */ }
```

- [ ] **Step 6: `MediaStrip.tsx`** — H2 "Kde jste o nás mohli slyšet?", grayscale row of text/SVG
  logos: iDNES, ČT, iRozhlas, TV Nova, CNN Prima (styled text placeholders, `grayscale opacity-70`).

- [ ] **Step 7: `Testimonials.tsx`** — H2 "Spokojení klienti", 3 cards: 5× `Star` (filled), quote,
  round avatar (`UserRound` or manifest avatar), first name (Alena, František, Jana). Static copy
  from Stitch.

- [ ] **Step 8: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 9: Commit**

```bash
git add components/home
git commit -m "feat(home): add Stitch section components"
```

---

## Task 9: Assemble Home page

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Replace the page body** — keep the existing data layer verbatim:
  `setRequestLocale(locale)`, `export const dynamic = "force-dynamic"`, and the
  `getLatestPosts(locale, 3)` try/catch. Replace the returned JSX with:

```tsx
return (
  <>
    <PromoRibbon />
    <Hero />
    <AboutBlock />
    <AudienceCards />
    <Steps />
    <BlogTeasers posts={latest} />
    <MediaStrip />
    <Testimonials />
  </>
);
```

Add the imports for `PromoRibbon` (from `@/components/layout/PromoRibbon`) and the seven home
components. Remove the now-unused `Container`/`Section`/`Button`/inline `AUDIENCE`/`STEPS` if no
longer referenced (lint will flag unused).

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/page.tsx
git commit -m "feat(home): assemble redesigned home page"
```

---

## Task 10: Lead form page + ContactForm restyle

**Files:**
- Modify: `app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/page.tsx`,
  `app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/ContactForm.tsx`
- Reference: `.stitch-export/lead-form.html` + manifest key `"lead-form"` (1 image)
- **Do NOT touch:** `actions.ts` (`submitLead`, zod, honeypot, Resend).

- [ ] **Step 1: Restyle page** — two-column Stitch layout (form left, peach contact panel right,
  stacks on mobile). Keep `metadata`, `setRequestLocale`, `<ContactForm />`, and `ORG` usage. Right
  panel: large `ORG.phoneDisplay`, hours from `ORG.hours`, `ORG.email`, trust line
  "Volání i poradenství jsou zdarma." Use the Stitch markup for the panel/photo.

- [ ] **Step 2: Restyle ContactForm** — keep `useActionState(submitLead, initial)`, the `Field`
  wrapper, all fields (`jmeno`, `email`, `telefon`, `psc`, `zprava`), the GDPR `souhlas` checkbox,
  the hidden honeypot `website`, the success state, and the error rendering. Only change classes:
  apply Stitch input styling (8–12px radius via `rounded-[var(--radius-md)]`, soft border, pink
  focus). Submit button stays the pink pill with `pending` label. **No field names or action change.**

- [ ] **Step 3: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/page.tsx" "app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/ContactForm.tsx"
git commit -m "feat(lead): restyle lead form page to Stitch design"
```

---

## Task 11: Calculator page + Calculator restyle

**Files:**
- Modify: `app/[locale]/kalkulacka/page.tsx`, `app/[locale]/kalkulacka/Calculator.tsx`
- Reference: `.stitch-export/calculator.html` + manifest key `"calculator"` (1 image)
- **Do NOT touch:** `lib/calculator.ts` (`AGE_BRACKETS`, `estimateSupport`).

- [ ] **Step 1: Restyle page** — keep `metadata`, intro prose, disclaimer, and the CTA `Button`/`Link`.
  Apply Stitch single-column tool layout. Optionally include Stitch's static
  "Proč je důležité znát své nároky?" prose section.

- [ ] **Step 2: Restyle Calculator** — keep all state (`income`, `children`, `result`, `error`),
  `AGE_BRACKETS`, `estimateSupport`, `addChild`/`removeChild`/`setChildPct`/`calculate`. Restyle
  the income input, per-child age `<select>` rows with "× odebrat" (use `X` icon) remove buttons,
  the outline "+ Přidat dítě" (`Plus` icon) button, the "Spočítat výživné" pink pill, and the peach
  result card (`bg-peach-light`) showing the total. **No logic change.**

- [ ] **Step 3: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 4: Commit**

```bash
git add "app/[locale]/kalkulacka/page.tsx" "app/[locale]/kalkulacka/Calculator.tsx"
git commit -m "feat(calculator): restyle calculator to Stitch design"
```

---

## Task 12: FAQ list page

**Files:**
- Modify: `app/[locale]/faq/page.tsx`
- Reference: `.stitch-export/faq.html`
- **Do NOT touch:** `lib/cms/faq.ts`.

- [ ] **Step 1: Restyle** — keep `getFaqs(locale)`, ordering, the per-item JSON-LD, `force-dynamic`,
  `metadata`, and the empty state. Apply Stitch accordion styling over the existing native
  `<details>`/`<summary>` (each `<summary>` shows the question + a `ChevronDown` that rotates via
  `group-open:rotate-180`/`[&[open]]` styling). Keep linking each item to its full answer page if
  the current page does. **Do NOT render fake "1 2 3 4" pagination** (`getFaqs` returns all items).

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/faq/page.tsx"
git commit -m "feat(faq): restyle FAQ accordion to Stitch design"
```

---

## Task 13: Blog list page

**Files:**
- Modify: `app/[locale]/blog/page.tsx`
- Reference: `.stitch-export/blog.html` + manifest key `"blog"` (6 images)
- **Do NOT touch:** `lib/cms/blog.ts`.

- [ ] **Step 1: Restyle** — keep `getPublishedPosts({ locale, page })`, the try/catch, empty state,
  `force-dynamic`, `metadata`, and the real pagination (`data.pages`, `data.page`). Apply the Stitch
  3-col card grid (thumbnail, title, excerpt, date from `publishedAt` formatted `cs-CZ`,
  "Celý článek »", hover lift). Thumbnail: post image if present on the model, else a `blog`
  manifest placeholder by index `i % blogImages.length`.

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/blog/page.tsx"
git commit -m "feat(blog): restyle blog listing to Stitch design"
```

---

## Task 14: Article page

**Files:**
- Modify: `app/[locale]/blog/[slug]/page.tsx`
- Reference: `.stitch-export/article.html` + manifest key `"article"` (4 images)
- **Do NOT touch:** `lib/cms/blog.ts`, `components/cms/RichText.tsx`.

- [ ] **Step 1: Restyle** — keep `getPostBySlug`, `notFound()`, `generateMetadata`, `force-dynamic`,
  the JSON-LD `<script>`, and `RichText` for the body. Apply the Stitch article shell: breadcrumb
  "Domů › Blog › <title>" (use `Link`), serif H1, meta line "<author> · <date cs-CZ>", the
  `RichText` prose body (keep `.prose-cms`), and a "Související články" row of 2–3 cards from
  `getLatestPosts(locale, 3)` filtered to exclude the current slug. **Omit the desktop TOC** (not
  derivable from arbitrary CMS HTML — documented).

- [ ] **Step 2: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/blog/[slug]/page.tsx"
git commit -m "feat(blog): restyle article page to Stitch design"
```

---

## Task 15: Contact / Support page

**Files:**
- Modify: `app/[locale]/kontakt/page.tsx`
- Maybe create: `components/contact/CopyAccountButton.tsx` (client)
- Reference: retried Stitch design IF it landed, else hand-build.

- [ ] **Step 1: Check whether the retried Stitch Support screen exists**

Use the Stitch MCP `list_screens` for project `9167525577675138775`. Look for a screen titled
"Podpořte naši činnost". If present, download its `htmlCode` + images into `.stitch-export/contact.html`
and `public/images/stitch/` (extend `manifest.json` with a `"contact"` key) and port it per the Recipe.

- [ ] **Step 2: If NOT present — hand-build in the shared visual language.** Keep `metadata`,
  `setRequestLocale`. Sections: serif H1 "Podpořte naši činnost"; donation prose (also funds school
  lunches/supplies); donation card (`bg-peach-light`, rounded) with `ORG.donationAccount` large +
  `<CopyAccountButton account={ORG.donationAccount} />` + a QR placeholder square; rounded photo
  (reuse a warm manifest image); "Kontakt" block from `ORG` (`legalName`, `ico`, `seat`, `office`,
  `dataBox`, `contactPerson`, `email`, `phoneDisplay`, hours); a map embed placeholder
  "Kancelář Kralovice" (`<div>` placeholder, not a live iframe).

- [ ] **Step 3: `CopyAccountButton.tsx` (only if used)**

```tsx
"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyAccountButton({ account }: { account: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <Button type="button" variant="outline" onClick={copy}>
      {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {copied ? "Zkopírováno" : "Kopírovat číslo účtu"}
    </Button>
  );
}
```

- [ ] **Step 4: Verify** — `pnpm lint && pnpm exec tsc --noEmit`.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/kontakt/page.tsx" components/contact 2>/dev/null; git add "app/[locale]/kontakt/page.tsx"
git commit -m "feat(contact): redesign support/donations page"
```

---

## Task 16: Full verification & visual compare

**Files:** none (verification only)

- [ ] **Step 1: Production build (catches type + RSC issues)**

```bash
pnpm build
```
Expected: build succeeds. (`build` runs `prisma generate` first — ensure Prisma client generates;
if DB env is absent the build may still complete since pages are `force-dynamic`.)

- [ ] **Step 2: Run dev and visually compare each route against `.stitch-export/*.html`**

```bash
pnpm dev
```
Check, at desktop + mobile widths:
- `/` — ribbon dismiss, hero, about, audience cards, steps anchor (hero "Jak začít?" scrolls to steps), blog teasers (or hidden when empty), media strip, testimonials, CTA band, footer.
- `/chci-pomoc-s-vymahanim-vyzivneho` — two-column; submit empty form → validation errors; valid submit → success state (or graceful error if Resend env absent).
- `/kalkulacka` — add/remove child rows; "Spočítat výživné" produces a total in the peach card.
- `/faq` — accordions expand/collapse; chevron rotates; no fake pager.
- `/blog` — card grid + real pagination; empty state when DB absent.
- `/blog/<slug>` — breadcrumb, H1, meta, prose, related row.
- `/kontakt` — donation card + copy button + contact block.
- Header mobile drawer opens/closes via keyboard; focus visible throughout.

- [ ] **Step 3: Accessibility spot-check** — visible pink focus rings on all interactive elements;
  one `<h1>` per page; images have alt; drawer is focus-trapped (Radix).

- [ ] **Step 4: Final commit if any fixes were made**

```bash
git add -A
git commit -m "fix(redesign): post-verification adjustments"
```

---

## Self-Review (completed by plan author)

**Spec coverage:** §4.1 tokens→Task 1; §4.2 icons→Recipe step 4 (all tasks); §4.3 images→Task 2 +
Recipe step 6; §5.1 Header/MobileNav→Tasks 3-4; §5.2 PromoRibbon→Tasks 5,9; §5.3 CtaBand & §5.4
Footer→Task 6; §6 primitives→reused (Button variants already cover primary/outline/ghost; no change
needed); §7.1 Home→Tasks 8-9; §7.2 Lead→Task 10; §7.3 Calculator→Task 11; §7.4 FAQ→Task 12; §7.5
Blog→Task 13; §7.6 Article→Task 14; §7.7 Contact→Task 15; §8 a11y→Recipe + Task 16; §10
verification→Task 16. All covered.

**Placeholder scan:** No "TBD/handle edge cases". The two visual-only omissions (TOC, fake
pagination) and the decorative search icon are explicit decisions from the approved spec, not gaps.
Bulk page markup is intentionally sourced from `.stitch-export/*.html` (committed files) rather than
re-transcribed, with the exact adaptation steps in the Porting Recipe.

**Type consistency:** `BlogTeasers({ posts })` shape matches `getLatestPosts` fields used
(`id, slug, title, excerpt`); `CopyAccountButton({ account })`, `MobileNav({ items, calculatorLabel,
getHelpLabel })`, and `lib/stitch-images.ts` exports (`imgSrc`, `pageImages`, `altText`) are used
consistently where referenced.
