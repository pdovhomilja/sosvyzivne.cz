# Endorsements CMS ("Spokojení klienti") — Design

**Date:** 2026-06-14
**Status:** Approved

## Goal

Let admins manage the home page "Spokojení klienti" (satisfied clients / endorsements)
section through the CMS, exactly the way blog posts and FAQ entries are managed today.
The section currently renders three hardcoded testimonials in
`components/home/Testimonials.tsx`; it must become data-driven.

## Context

The CMS is unified: blog and FAQ are not separate systems, they are `type` values on a
single `Content` model, managed through one admin list (`/content`) and one form
(`components/cms/content-form.tsx`). Per-type structured data lives in the `Content.data`
JSON column (e.g. FAQ stores `{ order, category }`). Endorsements follow this same
pattern as a new `ENDORSEMENT` content type — no new admin route, no new model.

## Decisions (from brainstorming)

- **Avatar:** optional uploaded photo via the existing UploadThing `mediaImage` route,
  falling back to an initial-letter avatar when no photo is set.
- **Rating:** editable per endorsement, 1–5, default 5.
- **Fields:** name, role, quote, display order, plus a consent flag and optional
  location/city.
- **Home wiring:** replace the hardcoded testimonials now; migrate the current three into
  seed data.

## Data Model

Add `ENDORSEMENT` to the `ContentType` enum in `prisma/schema.prisma`. **No new columns** —
reuse the existing `Content` fields:

| Content field | Endorsement meaning |
|---|---|
| `title` | Client name (e.g. "Alena") |
| `body` | Quote text (plain text) |
| `coverImage` | Optional client photo URL (UploadThing); nullable |
| `slug` | Required by `@@unique([type, locale, slug])`; admin-entered (e.g. `alena`). No public detail page. |
| `status` | Only `PUBLISHED` renders on the home page |
| `locale` | `cs` (existing single-locale behavior) |
| `data` (JSON) | `{ order, role, location?, rating, consent }` |

Migration: additive enum value only (safe, no data backfill).

## Validation — `lib/cms/schemas.ts`

New schema mirroring `faqData`:

```ts
export const endorsementData = z.object({
  order: z.number().int().min(0).default(0),
  role: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  consent: z.boolean().default(false),
});
```

Add `ENDORSEMENT` to `ContentTypeEnum`. Wire `endorsementData` into
`contentInputDiscriminated` exactly as `faqData` is wired (map issues onto the `data.*`
path). `coverImage` is already part of `contentInput`.

## Read Helper — `lib/cms/endorsements.ts` (new)

Mirror `lib/cms/faq.ts`:

```ts
export type EndorsementItem = {
  id: string;
  name: string;     // title
  quote: string;    // body
  role?: string;
  location?: string;
  rating: number;   // 1–5
  photo?: string;   // coverImage
  order: number;
};

export async function getEndorsements(locale: string): Promise<EndorsementItem[]>;
```

Query `type: "ENDORSEMENT", status: "PUBLISHED", locale`, select
`id, title, body, coverImage, data`, map via `endorsementData.safeParse`, sort by `order`.

## Admin Form — `components/cms/content-form.tsx`

- Add `ENDORSEMENT` to the type `<select>` ("Reference" label).
- Extend `ContentValues` with `role`, `location`, `rating`, `consent`, `coverImage`.
- When type is `ENDORSEMENT`, render: name (relabeled `title`), quote (relabeled `body`,
  plain `Textarea`), role, location, rating (number input 1–5), consent checkbox, and a
  photo uploader using `useUploadThing("mediaImage")` from `lib/uploadthing/client` that
  stores the returned URL into `coverImage` (shows current photo + a "remove" affordance).
- Hide blog/FAQ-only fields (excerpt, FAQ order/category, SEO block) for this type.
- `save()` payload sends `coverImage` and, for `ENDORSEMENT`, `data: { order, role,
  location, rating, consent }`.

## Actions — `actions/cms/content.ts`

Add `ENDORSEMENT` handling to `revalidatePublic`: revalidate `/` (home page) on
create/update/delete. `publicPathFor` returns `null` for endorsements (no detail page).
`coverImage` already flows through `createContent`/`updateContent`.

## Edit Page — `app/[locale]/(admin)/content/[id]/edit/page.tsx`

Parse `endorsementData` from `row.data` (alongside existing `faqData` parsing) and pass
`role`, `location`, `rating`, `consent`, and `coverImage` into the form's `initial` values.

## Home Section — `components/home/Testimonials.tsx`

- Make it a server component that calls `getEndorsements("cs")` (home page is already
  `force-dynamic`).
- Keep the current visual design verbatim. The 5-star row uses the per-record `rating`.
  Avatar shows `photo` when present, otherwise the initial letter of `name`.
- If the query is empty or the DB is unavailable, render nothing (graceful, matching the
  blog teasers' try/catch behavior). The page-level fetch wraps the call in try/catch.

## Seed — `scripts/seed-content.ts`

Add the three current testimonials (Alena, František, Jana) as `ENDORSEMENT` rows with
`order` 1–3, `rating: 5`, `consent: true`, upserted by `type_locale_slug`.

## Out of Scope

- No public `/reference` listing or detail pages.
- No dedicated admin route — management lives in the unified `/content` list and form.
- No additional locales beyond the existing `cs`.

## Testing / Verification

- `pnpm db:migrate` applies the additive enum migration cleanly.
- Create/edit/delete an `ENDORSEMENT` in `/content`; confirm it appears in the list with
  type shown and round-trips through the edit form (including photo, rating, consent).
- `pnpm seed:content` upserts the three endorsements.
- Home page renders endorsements from the DB; rating and photo/initial fallback display
  correctly; empty DB renders no section without error.
- `pnpm lint` and `pnpm build` pass.
