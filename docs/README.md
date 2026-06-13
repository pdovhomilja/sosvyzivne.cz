# SOSvyzivne.cz — Redesign Documentation

Comprehensive documentation for rebuilding **SOSvyzivne.cz** (SOS výživné nadační fond) on Next.js.
Captured from the live WordPress/Elementor site on **2026-06-13** via crawl.

The current site is a Czech-language non-profit (nadační fond) that helps single parents, students,
and divorced people enforce unpaid child support / alimony (*výživné / alimenty*). All services are free.

## What this site does (one paragraph)

A lead-generation + education site. The core conversion is the **"Chci pomoc s vymáháním výživného"**
(I want help enforcing child support) contact form. Around it sits a trust-building content engine:
an "About us" homepage, an alimony **calculator**, an **FAQ** knowledge base, a **blog** of legal
explainer articles, media mentions, testimonials, and a **donations** page. The audience is in a
stressful legal/financial situation, so the tone is empathetic, reassuring, and authoritative.

## Documentation index

| File | Contents |
|------|----------|
| [`01-site-overview.md`](./01-site-overview.md) | Mission, audience, information architecture, full sitemap, navigation |
| [`02-design-system.md`](./02-design-system.md) | Design tokens (colors, type, spacing), components, layout patterns, Tailwind config |
| [`03-content-inventory.md`](./03-content-inventory.md) | All page copy verbatim, blog & FAQ inventory, organization facts |
| [`04-page-templates.md`](./04-page-templates.md) | Section-by-section layout breakdown of every page template |
| [`05-nextjs-architecture.md`](./05-nextjs-architecture.md) | Proposed Next.js app structure, routing, components, content model, forms, calculator, i18n, SEO |
| [`06-migration-and-seo.md`](./06-migration-and-seo.md) | URL map, redirects, SEO metadata, analytics, launch checklist |
| [`07-techstack-and-architecture.md`](./07-techstack-and-architecture.md) | **Chosen blueprint** copied from `aqunama.com-v2`: exact stack, public + admin route architecture, better-auth, Prisma CMS, RBAC/audit — and how to adapt it to SOSvyzivne |

## Key facts at a glance

- **Org:** SOS výživné nadační fond · IČO 17850983 · datová schránka `xg9bbex`
- **Seat:** Žihle 232, 331 65 Žihle · **Office:** Masarykovo nám. 1, 331 41 Kralovice
- **Contact:** info@sosvyzivne.cz · +420 602 842 888 · [facebook.com/SOSvyzivne](https://www.facebook.com/SOSvyzivne)
- **Hours:** Mon 08:00–16:00, Thu 08:00–14:00 (Thu shows 16:00 on the contact page — confirm)
- **Donation account:** 131-1390040247/0100
- **Operating since:** 2019 (became a nadační fond later) · ~2,000 active clients
- **Current stack:** WordPress + Elementor 3.35.5 · Open Sans + Playfair Display · pink/terracotta palette
- **Language:** Czech only (`cs_CZ`) — i18n-ready architecture recommended but single-locale at launch

## How to use these docs

`07` + `05` are the build spec — **`07` is the chosen technical blueprint** (stack, public/admin
architecture, auth, CMS) lifted from the working `aqunama.com-v2` project; `05` covers
SOSvyzivne-specific pieces (lead form, calculator, SEO). `02`–`04` are the source of truth for look
and content. `06` is the cutover plan. Before writing code, read the local Next.js guides in
`node_modules/next/dist/docs/` — per `AGENTS.md`, this project pins a Next.js version whose APIs and
file conventions may differ from common knowledge.
