# 04 — Page Templates (section-by-section layout)

ASCII wireframes of each template. These describe **layout & composition**, not pixel design —
pair with `02-design-system.md` for tokens and `03-content-inventory.md` for copy.

Global chrome wraps every page:

```
┌───────────────────────────────────────────────────────────────┐
│ TOP BAR  info@…  | Pracovní doba | +420 602 842 888 | [f]        │  utility bar, accent bg
├───────────────────────────────────────────────────────────────┤
│ [LOGO]      O nás  FAQ  Blog  Podpořte   [🔍]   [Kalkulačka]    │  sticky header
│                                          [Chci pomoc] (button)   │  ← add primary CTA here
└───────────────────────────────────────────────────────────────┘
        ... page content ...
┌───────────────────────────────────────────────────────────────┐
│  CTA BAND:  Chci pomoc s vymáháním výživného                    │  global, above footer
│             Pomůžeme vám získat alimenty… [Chci pomoc]          │
├───────────────────────────────────────────────────────────────┤
│ FOOTER  [logo]   Kontakt block   Adresa block   © 2026          │
└───────────────────────────────────────────────────────────────┘
```

Mobile: hamburger → drawer; CTA button persists; top bar collapses to phone + FB.

---

## HomePage `/`

```
┌─ PROMO RIBBON ────────────────────────────────────────────────┐
│ Stát uhradí za neplatiče výživné >>> více informací  →article  │
└────────────────────────────────────────────────────────────────┘
┌─ HERO ─────────────────────────────────────────────────────────┐
│   (serif H1, centered)                                          │
│   „Nečekejte! Získejte výživné, na které mají vaše děti nárok.“│
│            [ Jak začít? ] (anchor → #jak)                       │
│   background: warm photo / peach tint                           │
└────────────────────────────────────────────────────────────────┘
┌─ O NÁS (about) ────────────────────────────────────────────────┐
│  H2 "O nás"   long-form prose (see content inventory)           │
│  [ photo, rounded ]                                             │
│  [VÝROČNÍ ZPRÁVA 2023]  [VÝROČNÍ ZPRÁVA 2024]                    │
└────────────────────────────────────────────────────────────────┘
┌─ MÁM NÁROK NA VAŠI SLUŽBU? (3 cards) ──────────────────────────┐
│  [img]            [img]              [img]                      │
│  Samoživitel      Rozvedená/ý        Plnoletý student           │
│  short text       short text         short text                 │
│  (each → relevant article)                                      │
└────────────────────────────────────────────────────────────────┘
┌─ JAK POSTUPOVAT?  (#jak) ──────────────────────────────────────┐
│   (1) rozsudek  →  (2) plná moc  →  (3) zařídíme my             │
│              [ Chci pomoc ] (CTA → form)                         │
└────────────────────────────────────────────────────────────────┘
┌─ NOVINKY Z BLOGU (3 latest) ───────────────────────────────────┐
│  [card] [card] [card]            [Zobrazit vše →/blog]          │
└────────────────────────────────────────────────────────────────┘
┌─ KDE JSTE O NÁS MOHLI SLYŠET (media logos) ────────────────────┐
│  iDNES  ČT  iRozhlas  TV Nova  CNN Prima                        │
└────────────────────────────────────────────────────────────────┘
┌─ SPOKOJENÍ KLIENTI (testimonials) ─────────────────────────────┐
│  ★★★★★ Alena   ★★★★★ František   ★★★★★ Jana                     │
└────────────────────────────────────────────────────────────────┘
┌─ KONTAKT + ADRESA ─────────────────────────────────────────────┐
│  contact block            address / legal block                │
└────────────────────────────────────────────────────────────────┘
```

Data needs: latest 3 posts (from CMS/MDX), static testimonials, static media logos, static org info.

---

## ContactFormPage `/chci-pomoc-s-vymahanim-vyzivneho/`

```
┌───────────────────────────┬─────────────────────────────┐
│  H2 Chci pomoc…           │  SIDE PANEL                  │
│  ┌─────────────────────┐  │  +420 602 842 888            │
│  │ Jméno a příjmení    │  │  Po 08:00–16:00              │
│  │ Email               │  │  Čt 08:00–14:00              │
│  │ Telefon             │  │  info@sosvyzivne.cz          │
│  │ PSČ                 │  │                              │
│  │ Zpráva (textarea)   │  │                              │
│  │ [ ] GDPR souhlas ✦  │  │  ✦ = add for redesign        │
│  │ [ Chci pomoc ]      │  │                              │
│  └─────────────────────┘  │                              │
└───────────────────────────┴─────────────────────────────┘
```

Behavior: client-validated → server action / API route → email (Resend/SMTP) + optional CRM.
States: idle / submitting / success / error. Honeypot + rate-limit. Real `<label>`s. Two columns
collapse to one on mobile.

---

## CalculatorPage `/kalkulacka/`

```
┌───────────────────────────────────────────────────────────┐
│  H1 Kalkulačka výživného                                   │
│  intro: vychází z tabulek Ministerstva spravedlnosti       │
│                                                            │
│  Čistý měsíční příjem rodiče (Kč): [_________]             │
│                                                            │
│  Dítě 1   věk: [0-5 let ▾]        [x odebrat]              │
│  Dítě 2   věk: [15-17 let ▾]      [x odebrat]              │
│  [ + Přidat dítě ]                                         │
│  ───────────────────────────────────────                  │
│  [ Spočítat výživné ]                                      │
│                                                            │
│  ┌─ RESULT ───────────────────────────────────────────┐   │
│  │ Celkové doporučené výživné: X XXX Kč                │   │
│  └────────────────────────────────────────────────────┘   │
│  Upozornění: skutečnou výši určuje soud…                   │
│  [ Chci pomoc s vymáháním výživného ]                      │
└───────────────────────────────────────────────────────────┘
```

Client component (`"use client"`). Pure-function calc (no server). Age is a **dropdown** (5 fixed
brackets), not a free numeric input. See exact algorithm + percentages in `05`.

---

## ListingPage — FAQ `/faq/` and Blog `/blog/`

```
┌───────────────────────────────────────────────────────────┐
│  H1 (Často kladené dotazy  /  Blog)                        │
│                                                            │
│  FAQ variant:  list of question links (or <Accordion>)     │
│    › Question …                          [Celý článek »]   │
│    › Question …                          [Celý článek »]   │
│                                                            │
│  Blog variant:  grid of cards                              │
│    [thumb] Title / excerpt / date / Celý článek »          │
│                                                            │
│  ◄ 1  2  3  4 ►   (pagination)                             │
└───────────────────────────────────────────────────────────┘
```

FAQ improvement option: render answers inline as an accessible accordion **and** keep
deep-linkable answer pages for SEO.

---

## ArticlePage — blog posts & FAQ answers

```
┌───────────────────────────────────────────────────────────┐
│  breadcrumb: Domů › Blog › Title                           │
│  H1 Title                                                  │
│  meta: autor · datum                                       │
│  ── article body (prose) ──                                │
│  intro paragraph                                           │
│  ## H2 section                                             │
│  - bulleted list                                           │
│  [ Stáhnout formulář ZDE ] (external/doc links)            │
│  closing: kontaktujte nás…                                 │
│  ── related articles (optional) ──                         │
└───────────────────────────────────────────────────────────┘
+ global CTA band + footer
```

Content via MDX or headless CMS. Render with a typographic `prose` style. Add `Article`/`FAQPage`
JSON-LD. Show table of contents for long articles (optional).

---

## StaticContentPage — Podpořte naši činnost `/kontakt/`

```
┌───────────────────────────────────────────────────────────┐
│  H1 Podpořte naši činnost                                  │
│  donation prose + bank account 131-1390040247/0100         │
│  [ photo ]                                                 │
│  ── Kontakt ──   org legal block + kontaktní osoba         │
│  [ Google Map embed of Kralovice office ]                  │
└───────────────────────────────────────────────────────────┘
```

Consider adding QR platba (Czech bank QR) for the donation account — common UX win for CZ donors.

---

## AuthorArchivePage `/author/<slug>/`

```
┌───────────────────────────────────────────────────────────┐
│  Autor: <Name>   [optional bio + photo]                    │
│  list of that author's posts (paginated)                   │
└───────────────────────────────────────────────────────────┘
```

Low priority — can be `noindex` or consolidated. Clean up the email-derived slugs.
