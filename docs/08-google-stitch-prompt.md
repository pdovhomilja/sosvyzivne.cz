# 08 — Google Stitch Design Prompt

A ready-to-paste prompt for **Google Stitch** (stitch.withgoogle.com) to generate a brand-new
design for the SOS výživné website. Stitch designs **one screen at a time** best, so this file is
structured as:

1. A **master context block** — paste it once, or prepend it to each screen prompt so Stitch keeps
   the brand consistent.
2. **Per-screen prompts** — paste one at a time to generate each page.

> Tips for Stitch:
> - Start in **Standard mode** for layout, switch to **Experimental** if you want bolder visuals.
> - Generate the **Home** screen first, then reuse "make it match the previous screen's style" phrasing.
> - Keep the language English in the prompt but ask Stitch to render the **UI copy in Czech** (below).
> - After generation, iterate with short follow-ups: "make the hero photo warmer", "tighten card spacing".

---

## 1. MASTER CONTEXT BLOCK (paste once, or prepend to every screen)

```
You are designing a modern, accessible website for a Czech non-profit foundation called
"SOS výživné nadační fond". The foundation helps single parents and others enforce unpaid
child support (alimony, "výživné") through free legal help, administration, and court
execution against non-payers. The service is completely free; the client always receives
the full debt amount.

AUDIENCE & EMOTIONAL TONE:
Visitors are stressed, financially strained single parents and divorced people who feel
intimidated by courts and bureaucracy. The design must LOWER ANXIETY and project two things
at once: warmth/empathy (a caring non-profit) and competence/credibility (a capable legal
partner). Avoid anything cold, corporate, childish, or sales-y. Calm, reassuring, trustworthy,
human. Generous whitespace, soft edges, real human photography (single parents and children,
warm and authentic — not stocky or staged).

BRAND VISUAL STYLE:
- Mood: warm, soft, editorial, premium non-profit. Think "trusted advisor who also cares".
- Color palette:
    Primary pink/magenta  #D3578D  (primary buttons, key accents)
    Primary hover         #BC436F
    Soft peach            #F8C0BA  (soft section fills, card tints)
    Light peach tint      #FDEBE9  (alternating section backgrounds)
    Terracotta accent     #CD625D  (headings accents, links)
    Body ink (near-black) #2A2320  (all body text — warm, high contrast)
    Muted ink             #6B5F5A  (captions, secondary text)
    Hairline border       #ECE2DF
    Surface white         #FFFFFF  (page + cards)
    Subtle surface        #FBF7F6
    Use WHITE text on the pink buttons. Use dark ink #2A2320 for body, NOT terracotta.
- Typography: elegant serif headings + clean humanist sans body.
    Headings: "Playfair Display" (serif), large, confident, slightly editorial.
    Body & UI: "Open Sans" (sans-serif), 16px minimum, line-height ~1.65, very readable.
- Shape & spacing: friendly, soft. Card/input corner radius 8–12px. Primary buttons are
    fully rounded pills. 4px spacing scale, generous vertical rhythm between sections.
    Centered content container ~1200px max width.
- Layout signature: single centered column, sections alternate white and soft peach tint,
    serif section headings centered above each section, 3-up card grids that stack on mobile.

ACCESSIBILITY (WCAG 2.2 AA):
Body text >= 16px, contrast >= 4.5:1, visible focus rings in brand pink, real form labels
(not placeholder-only), keyboard-friendly nav and mobile drawer, skip-to-content link.

UI COPY LANGUAGE: render all visible interface text in CZECH (examples given per screen).
Provide both mobile and desktop layouts. Modern, responsive, clean, production-grade.
```

---

## 2. PER-SCREEN PROMPTS

### Global chrome (mention on every screen)

```
Every page shares this chrome:
- A thin TOP UTILITY BAR (terracotta/accent background): "info@sosvyzivne.cz" · "Pracovní doba"
  · phone "+420 602 842 888" · a small Facebook icon.
- A STICKY HEADER (white): logo on the left; nav links "O nás", "Často kladené dotazy", "Blog",
  "Podpořte naši činnost"; a search icon; a secondary "Kalkulačka výživné" button; and a
  PROMINENT primary pill button "Chci pomoc" (this is the main call-to-action — make it stand out).
  On mobile, nav collapses to a hamburger drawer; the "Chci pomoc" button stays visible.
- Above the footer on every page: a full-width CTA BAND on a soft pink/peach background with the
  serif headline "Chci pomoc s vymáháním výživného", subtext "Pomůžeme vám získat alimenty,
  na které máte právo!", and a pill button "Chci pomoc".
- FOOTER (warm dark or peach): logo + tagline, a "Kontakt" block (email, working hours, phone),
  an "Adresa" block (legal name, IČO, seat), and "© 2026 SOSvyzivne.cz".
```

### Screen A — Home page (`/`)

```
Design the HOME PAGE. Sections top to bottom:

1. PROMO RIBBON (thin, dismissible) below the header: "Stát uhradí za neplatiče výživné →
   více informací".
2. HERO: a warm, full-width photo of a single parent with a child (authentic, hopeful). Over it,
   a large centered Playfair serif headline: "Nečekejte! Získejte výživné, na které mají vaše
   děti nárok." One reassuring sub-line, and a single pill CTA "Jak začít?". Keep it calm and
   uncluttered — the headline is the hero.
3. "O nás" (About): a serif H2, two-column block — warm rich text on one side, a rounded photo on
   the other, and two outline buttons "Výroční zpráva 2023" and "Výroční zpráva 2024".
4. "Mám nárok na vaši službu?": a serif H2, then THREE cards in a row, each with a rounded photo,
   a title, and short text: "Rodič samoživitel/ka", "Rozvedený/á", "Plnoletý student".
5. "Jak postupovat?": three numbered steps with soft icons — (1) "Rozsudek o výživném",
   (2) "Podepíšete plnou moc", (3) "Vše ostatní zařídíme my" — then a pill CTA "Chci pomoc".
   Put this section on a soft peach tint background.
6. "Novinky z blogu": serif H2, three blog teaser cards (thumbnail, title, excerpt, "Celý článek »")
   and a "Zobrazit vše" link.
7. "Kde jste o nás mohli slyšet?": a quiet grayscale logo strip — iDNES, ČT, iRozhlas, TV Nova,
   CNN Prima.
8. "Spokojení klienti": three testimonial cards, each with a 5-star rating, a quote, a small round
   avatar, and a first name (Alena, František, Jana).
9. CTA BAND + FOOTER (global chrome above).

Alternate white and soft-peach backgrounds between sections. Show desktop and mobile.
```

### Screen B — Lead form page (`/chci-pomoc-s-vymahanim-vyzivneho/`)

```
Design the "Chci pomoc" LEAD FORM PAGE — the most important conversion screen, so it must feel
safe, simple, and reassuring. Two-column layout that stacks on mobile:

LEFT: serif H2 "Chci pomoc s vymáháním výživného", a one-line empathetic intro, then a clean form
with real labels stacked above each field:
  - "Jméno a příjmení"
  - "E-mail"
  - "Telefon"
  - "PSČ"
  - "Zpráva" (textarea)
  - a GDPR consent checkbox with a short label
  - a full-width primary pill submit button "Chci pomoc".
Inputs have 8–12px radius, soft borders, clear focus states in brand pink.

RIGHT: a soft peach side panel with contact reassurance — phone "+420 602 842 888" (large),
working hours "Po 08:00–16:00", "Čt 08:00–14:00", and "info@sosvyzivne.cz". Add a small trust line
like "Volání i poradenství jsou zdarma."

Also show the success state (a friendly confirmation message replacing the form).
```

### Screen C — Alimony calculator (`/kalkulacka/`)

```
Design the "Kalkulačka výživného" CALCULATOR PAGE — a friendly interactive tool. Centered single
column:
  - serif H1 "Kalkulačka výživného" and an intro line "Orientační výpočet podle tabulek
    Ministerstva spravedlnosti."
  - a numeric input "Čistý měsíční příjem rodiče (Kč)".
  - repeatable child rows: "Dítě 1" with an age dropdown (brackets like "0–5 let", "6–9 let",
    "10–14 let", "15–17 let", "18+ let") and a small "× odebrat" remove button; an outline
    "+ Přidat dítě" button to add rows.
  - a primary pill button "Spočítat výživné".
  - a prominent RESULT CARD (soft peach, rounded) showing "Celkové doporučené výživné: 8 500 Kč".
  - a small disclaimer "Upozornění: skutečnou výši určuje soud." and a pill CTA
    "Chci pomoc s vymáháním výživného".
Make it feel light, encouraging, and easy — not like a tax form.
```

### Screen D — Listing page (FAQ and Blog) (`/faq/`, `/blog/`)

```
Design TWO variants of a LISTING PAGE.

FAQ variant: serif H1 "Často kladené dotazy", then an accessible accordion of question rows
(question text + chevron, expanding to an answer), each also linking to a full answer page. Calm,
lots of breathing room. Pagination at the bottom "1 2 3 4".

Blog variant: serif H1 "Blog", then a responsive grid of article cards (thumbnail, title, short
excerpt, date, "Celý článek »"). Pagination at the bottom. Cards have soft rounded corners and a
subtle hover lift.
```

### Screen E — Article / answer page (`/<slug>/`)

```
Design an ARTICLE PAGE for a legal explainer / blog post. A readable single column, max ~720px text
width, centered:
  - breadcrumb "Domů › Blog › Název článku"
  - serif H1 title
  - meta line "Autor · 13. června 2026"
  - a typographic prose body: lead paragraph, H2 sections, bulleted lists, an inline download button
    "Stáhnout formulář ZDE", and a closing paragraph that invites contact.
  - an optional small table of contents on the side for desktop.
  - a "Související články" row of 2–3 cards at the bottom.
  - then the global CTA band + footer.
Beautiful, calm long-form reading typography in Open Sans with Playfair headings.
```

### Screen F — Support / contact page (`/kontakt/`)

```
Design the "Podpořte naši činnost" PAGE (donations + contact). Centered single column:
  - serif H1 "Podpořte naši činnost"
  - warm donation prose explaining the foundation also funds school lunches and supplies.
  - a DONATION CARD (soft peach, rounded) with the bank account "131-1390040247/0100" shown large,
    a "Kopírovat číslo účtu" button, and a Czech bank QR-platba code placeholder.
  - a rounded photo.
  - a "Kontakt" section: organization legal block (name, IČO, sídlo, datová schránka) and a contact
    person.
  - a Google Map embed placeholder of the Kralovice office.
  - global CTA band + footer.
```

---

## 3. ONE-SHOT SHORT PROMPT (if you want a single quick generation)

Paste this if you just want Stitch to produce a strong first concept of the **home page** fast:

```
Design a modern, accessible home page for a Czech non-profit "SOS výživné" that helps stressed
single parents enforce unpaid child support for free. Tone: warm, empathetic, trustworthy, calm —
lowers anxiety, looks like a caring non-profit AND a competent legal partner. Elegant Playfair
Display serif headings + Open Sans body. Palette: pink #D3578D primary buttons (white text), soft
peach #F8C0BA section fills, terracotta #CD625D accents, warm near-black #2A2320 body text, white
surfaces; pill-shaped buttons, 8–12px rounded cards, generous whitespace, sections alternating
white and soft peach, authentic warm photography of parents and children. Sticky header with logo,
nav (O nás, Často kladené dotazy, Blog, Podpořte naši činnost) and a prominent pink "Chci pomoc"
button. Sections: hero with serif headline "Nečekejte! Získejte výživné, na které mají vaše děti
nárok." and CTA "Jak začít?"; About "O nás"; three audience cards "Mám nárok na vaši službu?"; a
3-step "Jak postupovat?"; latest blog cards; a media-logo strip; testimonials with 5-star ratings;
a pink CTA band "Chci pomoc s vymáháním výživného"; and a footer with contact + address. All UI
copy in Czech. WCAG AA: 16px+ body, strong contrast, visible focus, real form labels. Provide
desktop and mobile.
```
