# Design: Admin-Managed Social Links

**Date:** 2026-06-17
**Status:** Approved (design) — pending spec review

## Goal

Let an admin manage the organisation's social-media links from the admin area, and
render them as icons in the public site header and footer. Ship with Facebook,
Instagram, and LinkedIn. Replace the current hardcoded header "Facebook" text link.

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Platforms | Facebook, Instagram, LinkedIn |
| Public placement | Footer brand column **and** header utility bar |
| Admin model | Fixed-field singleton `SiteSettings` row (not a flexible list) |
| Settings scope | Socials only for now (page is extensible later) |
| Refresh after save | `revalidatePath("/", "layout")` (site-wide) |
| Instagram URL | `https://www.instagram.com/sosvyzivne/` (seed default) |
| Facebook URL | `https://www.facebook.com/SOSvyzivne` (from `ORG`, seed default) |

## Units of work

### 1. Prisma model — `SiteSettings` (singleton)
```prisma
model SiteSettings {
  id           String   @id @default("singleton")
  facebookUrl  String?
  instagramUrl String?
  linkedinUrl  String?
  updatedAt    DateTime @updatedAt
}
```
- One row, fixed id `"singleton"`. All writes use `upsert({ where: { id: "singleton" } })`.
- Requires a migration (`pnpm db:migrate`). The build script runs `prisma generate`
  (types), but the table itself needs the migration applied to the database.

### 2. Read layer — `lib/social.ts`
- `export type SocialLinks = { facebook: string | null; instagram: string | null; linkedin: string | null }`.
- `DEFAULT_SOCIALS`: `{ facebook: ORG.facebook, instagram: "https://www.instagram.com/sosvyzivne/", linkedin: null }`.
- `getSocialSettings(): Promise<SocialLinks>` — wrapped in React `cache()` to dedupe
  the query within a single request (header + footer both call it).
  - If the singleton row **exists**, return its values verbatim (a cleared field →
    `null` → icon hidden; defaults never resurrect).
  - If the row is **missing** or the DB query throws, return `DEFAULT_SOCIALS` so
    Facebook + Instagram still render before the first admin save.

### 3. Shared UI — `components/SocialIcons.tsx`
- Props: `{ links: SocialLinks; variant: "header" | "footer"; className?: string }`.
- Renders only platforms whose URL is non-null. Each is an
  `<a href={url} target="_blank" rel="noopener noreferrer" aria-label="…">` wrapping
  a lucide icon: `Facebook`, `Instagram`, `Linkedin`.
- `variant="header"` → white icons (on terracotta bar); `variant="footer"` →
  primary-colored icons. Server component (no client state needed).

### 4. Public placement
- **Header** (`components/layout/Header.tsx`, already async): replace the hardcoded
  `<a ... aria-label="Facebook">Facebook</a>` in the utility bar with
  `<SocialIcons variant="header" links={await getSocialSettings()} />`. Remove the
  now-unused direct `ORG.facebook` reference in the header.
- **Footer** (`components/layout/Footer.tsx`): make it `async`, fetch
  `getSocialSettings()`, and add `<SocialIcons variant="footer" links={...} />` under
  the tagline in the brand column.

### 5. Admin
- **Sidebar** (`components/admin/sidebar.tsx`): add `{ href: "/settings", label: "Nastavení", icon: Settings }` (lucide `Settings`) to the `NAV` array.
- **Page** `app/[locale]/(admin)/settings/page.tsx`: server component
  (`export const dynamic = "force-dynamic"`), reads the singleton settings, renders
  `SocialSettingsForm` with current values. Auth is enforced by the existing
  `(admin)/layout.tsx` `requireAdmin()` choke point.
- **Form** `components/admin/SocialSettingsForm.tsx`: `"use client"`. Three URL
  inputs (Facebook, Instagram, LinkedIn) prefilled with current values. On submit,
  calls `updateSocialSettings`; shows a `sonner` success/error toast (matches
  existing admin UX). Uses existing UI primitives where available.
- **Action** `actions/cms/settings.ts`: `"use server"`.
  ```
  updateSocialSettings(raw): requireAdmin() → zod parse → upsert singleton → revalidatePath("/", "layout")
  ```
  zod (zod v4 style, cf. `actions/cms/users.ts`): each field is a valid URL or empty
  string; empty/whitespace normalises to `null` before the upsert.

### 6. Cleanup
- `ORG.facebook` stays in `lib/org.ts` (used as the seed default in `lib/social.ts`),
  but the header no longer references it directly — the link flows through
  `getSocialSettings()`.

## Out of scope
- YouTube / X / TikTok or any platform beyond the three above.
- Flexible add/remove/reorder social list.
- Non-social settings (the page is structured so they can be added later).
- A standalone seed script — defaults live in `lib/social.ts`; the row is created on
  first admin save.

## Verification
- `pnpm lint` + `pnpm build` clean (with `prisma generate`).
- Migration created for `SiteSettings`.
- Manual: header + footer show Facebook + Instagram icons by default; admin edits
  persist and reflect site-wide after save; clearing a field hides that icon;
  LinkedIn appears once a URL is entered.

## Conventions reminder
Per `AGENTS.md`: before writing route/caching/action code, check the relevant guide
under `node_modules/next/dist/docs/` — this Next.js (16.2.9) differs from older
versions, especially `revalidatePath(path, "layout")` semantics and server actions.
