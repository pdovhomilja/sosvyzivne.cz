# 01 — Site Overview & Information Architecture

## Mission & positioning

**SOS výživné nadační fond** is a Czech non-profit foundation that helps people enforce unpaid
child support / alimony (*výživné*). It provides end-to-end support — information, administration,
legal advice, and legal representation including execution (*exekuce*) against non-payers — **entirely
free of charge**. When enforcement succeeds, costs are recovered from the debtor; when it fails, the
foundation absorbs the cost. The client always receives the **full debt amount, uncut**.

The foundation also runs broader humanitarian/education programs (school lunches, school supplies,
encyclopedias for children in need).

- Operating since **2019**; converted to a *nadační fond* for transparency and efficiency.
- Currently represents **~2,000 clients**, with basic legal advice to hundreds more.
- Works **nationwide**, mostly **online / by phone** — no in-person visit required.

## Target audience

Three primary personas (mirrored in the homepage "Mám nárok na vaši službu?" section):

1. **Rodič samoživitel/ka** — single parent whose ex-partner does not pay child support.
2. **Rozvedený/á** — divorced person (spousal maintenance can exist between ex-spouses).
3. **Plnoletý student** — adult student (18+) still preparing for a future profession.

Emotional state: stressed, financially strained, intimidated by courts/bureaucracy. Design and copy
must reduce anxiety and project competence + warmth. Tone observed: empathetic, plain-language,
reassuring ("nezoufejte", "věřte, že rozumíme Vaší tíživé situaci"), action-oriented.

## Primary conversion goals

1. **Lead capture** — the *Chci pomoc s vymáháním výživného* form (name, email, phone, PSČ, message).
2. **Phone call** — `+420 602 842 888` exposed in top bar, hero-adjacent, contact, sticky CTA bar.
3. **Donations** — bank transfer on the *Podpořte naši činnost* page.
4. **Engagement / SEO** — calculator, FAQ, and blog drive organic traffic and trust.

## Information architecture

```
Home (O nás)  /
├── Chci pomoc s vymáháním výživného   /chci-pomoc-s-vymahanim-vyzivneho/   ← primary CTA / lead form
├── Kalkulačka výživného               /kalkulacka/                         ← interactive tool
├── Často kladené dotazy (FAQ)         /faq/  (+ /faq/2)                     ← Q&A hub → detail pages
│   └── <faq-question>                 /<slug>/                             ← individual answer pages
├── Blog                               /blog/ (+ /blog/2 … /blog/4)         ← article list, paginated
│   └── <article>                      /<slug>/                             ← individual articles
│       └── Author archive             /author/<author-slug>/(/page/N)
└── Podpořte naši činnost (Kontakt)    /kontakt/                            ← donations + contact details
```

### Global navigation

**Top utility bar:** `info@sosvyzivne.cz` · Pracovní doba (anchor) · `+420 602 842 888` · Facebook icon

**Primary nav (current, slightly inconsistent across views):**
- O nás (Home `/`)
- Často kladené dotazy (`/faq/`)
- Blog (`/blog/`)
- Podpořte naši činnost (`/kontakt/`)
- Search box ("Vyhledat pro:")
- **Kalkulačka výživného** (CTA button, links to `/kalkulacka`)

> Note: a secondary menu also lists "Chci pomoc s vymáháním výživného" and a stray "Test" page
> (`/test/`). The redesign should drop `/test/` and surface **Chci pomoc** as a prominent nav item
> or persistent button — it's the main conversion and currently under-exposed in the header.

### Footer

- Logo
- "Pomůžeme vám získat alimenty, na které máte právo!" tagline
- **Kontakt** block: email, working hours, phone
- **Adresa** block: legal name, IČO, seat, office, datová schránka ID
- Copyright © {year} SOSvyzivne.cz
- A reusable **footer CTA** ("Chci pomoc s vymáháním výživného") — in Elementor it's a saved template
  (`/elementor-hf/footer-call-to-action`); replicate as a shared footer CTA band.

### Recurring cross-page CTA band

Nearly every page ends with a band:
> **Chci pomoc s vymáháním výživného** — *Pomůžeme vám získat alimenty, na které máte právo!*

Treat this as a global layout component rendered above the footer on all content pages.

## Page-type taxonomy (for templating)

| Type | Examples | Template |
|------|----------|----------|
| Home / landing | `/` | `HomePage` (multi-section) |
| Lead form | `/chci-pomoc-s-vymahanim-vyzivneho/` | `ContactFormPage` |
| Tool | `/kalkulacka/` | `CalculatorPage` (client component) |
| List hub | `/faq/`, `/blog/` | `ListingPage` (paginated) |
| Article / answer | all the legal explainer slugs + FAQ answers | `ArticlePage` (MDX/CMS) |
| Author archive | `/author/<slug>/` | `AuthorArchivePage` |
| Info / static | `/kontakt/` | `StaticContentPage` |
| Asset | annual report PDFs | static files in `/public` or CMS media |

## Content volume (crawled)

- **~50 article/answer pages** (legal explainers + FAQ answers — many overlap).
- **20 FAQ questions** on page 1 (FAQ is paginated to `/faq/2`).
- **Blog** paginated across `/blog/` → `/blog/4` (≈ 4 pages of posts).
- **3+ authors**: Veronika Tůmová, Lenka Ranšová (`erik-zakovec…` slug), `jan@ruzickainternational.eu`.
- **2 annual report PDFs**: 2023, 2024.

Full inventory in [`03-content-inventory.md`](./03-content-inventory.md) and the URL map in
[`06-migration-and-seo.md`](./06-migration-and-seo.md).
