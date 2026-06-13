# 02 — Design System

Design tokens extracted from the live site (Firecrawl `branding` analysis + visual inspection of the
homepage). The current site is **Elementor 3.35.5**, light theme. The redesign should keep the warm,
empathetic, trustworthy feel while modernizing spacing, accessibility, and responsiveness.

## Brand personality

- **Tone:** professional, warm, reassuring. Energy: medium.
- **Feel:** caring non-profit + competent legal partner. Avoid cold/corporate and avoid childish.
- **Emotional job:** lower the visitor's anxiety, build trust, make the next step feel easy.

## Color palette

Extracted (confidence ~0.9 on colors):

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#D3578D` | Primary brand pink/magenta — buttons, highlights, accents |
| `secondary` | `#F8C0BA` | Soft peach — backgrounds, section tints, cards |
| `accent` | `#CD625D` | Terracotta / dusty rose — headings, links, secondary buttons |
| `background` | `#FFFFFF` | Page background |
| `text-primary` | `#CD625D` | Note: site uses the terracotta for headings; **body text should be a dark neutral** |
| `link` | `#CD625D` | Link color |

### Recommended refinements (for accessibility & hierarchy)

The terracotta `#CD625D` used for primary text fails WCAG AA against white for body copy. Introduce a
neutral text scale and reserve the brand colors for accents/headings/CTAs.

```css
/* Brand */
--color-primary:        #D3578D;  /* pink — primary CTA */
--color-primary-hover:  #BC436F;  /* darker pink for hover/active */
--color-secondary:      #F8C0BA;  /* peach — soft section fills */
--color-secondary-tint: #FDEBE9;  /* very light peach — alternating sections */
--color-accent:         #CD625D;  /* terracotta — headings/links accents */
--color-accent-hover:   #B14E49;

/* Neutrals (add for readable body text & UI) */
--color-ink:            #2A2320;  /* primary body text — warm near-black */
--color-ink-muted:      #6B5F5A;  /* secondary text, captions */
--color-border:         #ECE2DF;  /* hairlines, card borders */
--color-surface:        #FFFFFF;  /* cards / page bg */
--color-surface-muted:  #FBF7F6;  /* subtle section background */

/* Functional */
--color-success: #2E7D5B;
--color-error:   #C0392B;
--color-focus:   #D3578D;  /* focus ring = brand pink */
```

> **Verify in build:** the brand pink/terracotta on white must hit AA (4.5:1) for any text use, and
> button text on `#D3578D` must hit AA. Use white text on the pink button (passes), dark ink on peach.

## Typography

| Role | Family | Stack | Current size |
|------|--------|-------|--------------|
| Headings | **Playfair Display** (serif, elegant) | `"Playfair Display", serif` | H1 60px · H2 32px |
| Body / UI | **Open Sans** (humanist sans) | `"Open Sans", sans-serif` | 15px |

The serif/sans pairing (Playfair Display headings + Open Sans body) is the brand's signature and
should be preserved — it reads as caring + credible.

### Recommended type scale (responsive)

```css
--font-heading: "Playfair Display", Georgia, serif;
--font-body:    "Open Sans", system-ui, -apple-system, sans-serif;

/* Fluid scale (clamp = mobile → desktop) */
--text-h1:   clamp(2.25rem, 1.6rem + 3.2vw, 3.75rem);  /* ~36→60px */
--text-h2:   clamp(1.5rem,  1.2rem + 1.5vw, 2rem);      /* ~24→32px */
--text-h3:   clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem);
--text-lead: 1.125rem;   /* intro paragraphs */
--text-body: 1rem;       /* bump base from 15px → 16px for readability */
--text-sm:   0.875rem;
--leading-body: 1.65;
--leading-heading: 1.15;
```

Load fonts with `next/font/google` (Playfair Display 400/600/700, Open Sans 400/600/700) for zero
layout shift and self-hosting. Use `display: swap`.

## Spacing & shape

- Base spacing unit: **4px** (current). Keep a 4px scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- Border radius (current): **2px** — very square. Recommend softening to **8–12px** on cards/inputs
  and pill (`9999px`) on primary buttons to feel friendlier; keep it consistent via a token.

```css
--radius-sm: 6px;
--radius-md: 12px;
--radius-pill: 9999px;
--space-section-y: clamp(3rem, 2rem + 5vw, 6rem);  /* vertical rhythm between sections */
--container-max: 1200px;
--container-pad: clamp(1rem, 0.5rem + 2vw, 2rem);
```

## Components inventory (observed)

| Component | Where | Notes |
|-----------|-------|-------|
| **Top utility bar** | global header | email, hours anchor, phone (tel:), Facebook icon |
| **Header / nav** | global | logo left, links, search, Kalkulačka CTA button; needs sticky + mobile drawer |
| **Promo ribbon** | below header on home | "Stát uhradí za neplatiče výživné >>> více informací" → links to article |
| **Hero** | home | serif headline + single CTA ("Jak začít?" anchor to steps) |
| **Prose/intro block** | home, articles | long-form rich text |
| **Image figure** | home, donate, articles | rounded photo (people/stock) |
| **PDF buttons** | home | "VÝROČNÍ ZPRÁVA 2023 / 2024" link buttons |
| **Audience cards (3)** | home "Mám nárok na vaši službu?" | image + title + short text; samoživitel / rozvedený / student |
| **Steps (3)** | home "Jak postupovat?" | numbered icon (1,2,3) + caption, then CTA "Chci pomoc" |
| **Blog teaser cards (3)** | home "Novinky z blogu" | title + excerpt + "Celý článek »"; "Zobrazit vše" link |
| **Media logo strip** | home "Kde jste o nás mohli slyšet?" | iDNES, ČT, iRozhlas, TV Nova, CNN Prima (some linked) |
| **Testimonial cards** | home "Spokojení klienti" | 5-star rating, quote, avatar, first name (Alena, František, Jana) |
| **Contact / address blocks** | home, kontakt | structured org data |
| **Lead form** | /chci-pomoc | fields: Jméno a příjmení, Email, Telefon, PSČ, Zpráva + submit "Chci pomoc" |
| **Calculator** | /kalkulacka | income input + repeatable "Přidat dítě" (age) rows + "Spočítat výživné" |
| **FAQ list** | /faq | list of question links → answer pages; paginated |
| **Article body** | answer/blog pages | intro + H2 sections + bulleted lists + downloadable .docx/links + closing CTA |
| **Google map embed** | /kontakt | static map of office |
| **Sticky CTA band** | global (above footer) | "Chci pomoc s vymáháním výživného" + tagline |
| **Footer** | global | logo, contact, address, copyright |

## Layout patterns

- **Single-column, centered container** (~1200px max) with generous vertical section spacing.
- **Alternating section backgrounds** (white / soft peach tint) to separate sections.
- **3-up card grids** that stack to 1 column on mobile (audience cards, steps, blog teasers,
  testimonials).
- **Serif display headings** centered above each section, often with a short subhead.
- Photography: warm, real, human (single parents, children) — stock from Pexels currently.

## Accessibility goals for the redesign

The current Elementor site has typical issues (low-contrast terracotta text, decorative icons,
small 15px body). The redesign should target **WCAG 2.2 AA**:

- Body text ≥ 16px, line-height ≥ 1.5, contrast ≥ 4.5:1 (use `--color-ink`, not terracotta, for body).
- Visible focus rings (brand pink), keyboard-operable nav drawer & forms, skip-to-content link
  (the site already has "Přeskočit na obsah" — keep it).
- Form fields with real `<label>`s (current Elementor form uses placeholder-only labels — fix this).
- Star ratings exposed to AT (`aria-label="Hodnocení 5 z 5"`), not just icon glyphs.
- `prefers-reduced-motion` respected for any scroll/hover animation.
- Alt text on all content images; decorative images `alt=""`.

## Suggested Tailwind theme (v4 `@theme` tokens)

```css
@theme {
  --color-primary: #D3578D;
  --color-primary-hover: #BC436F;
  --color-secondary: #F8C0BA;
  --color-secondary-tint: #FDEBE9;
  --color-accent: #CD625D;
  --color-ink: #2A2320;
  --color-ink-muted: #6B5F5A;
  --color-border: #ECE2DF;
  --color-surface: #FFFFFF;
  --color-surface-muted: #FBF7F6;

  --font-heading: "Playfair Display", Georgia, serif;
  --font-body: "Open Sans", system-ui, sans-serif;

  --radius-sm: 6px;
  --radius-md: 12px;

  --spacing: 0.25rem; /* 4px base unit */
}
```

> Confirm the Tailwind version/config conventions against the local Next.js + Tailwind setup before
> implementing — see `AGENTS.md`. Tokens above are framework-agnostic; map them to whatever the
> project's styling layer is (Tailwind v4 `@theme`, CSS variables, etc.).
