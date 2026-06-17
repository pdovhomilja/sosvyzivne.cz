# Admin-Managed Social Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin manage Facebook/Instagram/LinkedIn URLs from the admin area and render them as icons in the public header and footer.

**Architecture:** A singleton `SiteSettings` Prisma row stores three nullable URLs. `lib/social.ts` reads it (React-`cache()`d, with code defaults when the row is absent). A shared `SocialIcons` server component renders the icons in the header utility bar and footer. An admin page + `"use server"` action edit the row and revalidate the layout.

**Tech Stack:** Next.js 16.2.9 (App Router, server actions), React 19, Prisma 7 (`@/lib/generated/prisma/client`), zod v4, sonner, lucide-react, Tailwind v4.

> **Testing note:** No test runner exists in this repo (intentional — do not add one). Pure verification is via `pnpm lint` + `pnpm build` (build runs `prisma generate`) plus manual checks. The DB-touching paths degrade gracefully: `getSocialSettings()` returns defaults if the table/row is missing, so the site builds and renders before the migration is applied.

> **Before writing action/caching code** (per `AGENTS.md`): skim `node_modules/next/dist/docs/` for server actions and `revalidatePath(path, "layout")` semantics in this Next.js version.

---

## File map

| File | Action | Responsibility |
|------|--------|----------------|
| `prisma/schema.prisma` | Modify | Add `SiteSettings` model |
| `lib/social.ts` | Create | Types, defaults, cached read of settings |
| `components/SocialIcons.tsx` | Create | Shared icon row (header/footer variants) |
| `components/layout/Header.tsx` | Modify | Replace text Facebook link with icons |
| `components/layout/Footer.tsx` | Modify | Add icon row to brand column (becomes async) |
| `actions/cms/settings.ts` | Create | `updateSocialSettings` server action |
| `app/[locale]/(admin)/settings/page.tsx` | Create | Admin settings page |
| `components/admin/SocialSettingsForm.tsx` | Create | Client edit form |
| `components/admin/sidebar.tsx` | Modify | Add "Nastavení" nav item |

---

## Task 1: `SiteSettings` Prisma model + client generation

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add the model**

Append to `prisma/schema.prisma` (after the existing models):

```prisma
model SiteSettings {
  id           String   @id @default("singleton")
  facebookUrl  String?
  instagramUrl String?
  linkedinUrl  String?
  updatedAt    DateTime @updatedAt
}
```

- [ ] **Step 2: Generate the Prisma client (types)**

Run: `pnpm db:generate`
Expected: regenerates `@/lib/generated/prisma/client`; `db.siteSettings` becomes available with `findUnique`/`upsert`.

- [ ] **Step 3: Create the migration**

If a dev database is reachable (DATABASE_URL set): run `pnpm db:migrate` and name it `add_site_settings` when prompted.
If no database is reachable: run `pnpm prisma migrate dev --create-only --name add_site_settings` to write the migration SQL without applying it (it will be applied in deploy via `pnpm db:deploy`).
Expected: a new folder under `prisma/migrations/<timestamp>_add_site_settings/migration.sql` containing `CREATE TABLE "SiteSettings"`.

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: succeeds (prisma generate + type-check pass).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/migrations
git commit -m "feat(settings): add SiteSettings singleton model for social links

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Read layer — `lib/social.ts`

**Files:**
- Create: `lib/social.ts`

- [ ] **Step 1: Create the file with EXACTLY this content**

```ts
import "server-only";
import { cache } from "react";
import db from "@/lib/db";
import { ORG } from "@/lib/org";

export type SocialLinks = {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
};

/** Seed values shown until the admin saves the singleton row for the first time. */
export const DEFAULT_SOCIALS: SocialLinks = {
  facebook: ORG.facebook,
  instagram: "https://www.instagram.com/sosvyzivne/",
  linkedin: null,
};

/**
 * Read social links. If the singleton row exists, its values are authoritative
 * (a cleared field stays null/hidden). If the row is missing or the DB errors,
 * fall back to DEFAULT_SOCIALS. `cache()` dedupes the query within one request
 * (header + footer both call this).
 */
export const getSocialSettings = cache(async (): Promise<SocialLinks> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SOCIALS;
    return {
      facebook: row.facebookUrl,
      instagram: row.instagramUrl,
      linkedin: row.linkedinUrl,
    };
  } catch {
    return DEFAULT_SOCIALS;
  }
});
```

- [ ] **Step 2: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add lib/social.ts
git commit -m "feat(settings): add cached social-links read layer with defaults

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Shared `SocialIcons` component

**Files:**
- Create: `components/SocialIcons.tsx`

- [ ] **Step 1: Create the file with EXACTLY this content**

```tsx
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SocialLinks } from "@/lib/social";

const PLATFORMS = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
] as const;

export function SocialIcons({
  links,
  variant,
  className,
}: {
  links: SocialLinks;
  variant: "header" | "footer";
  className?: string;
}) {
  const items = PLATFORMS.filter((p) => links[p.key]);
  if (items.length === 0) return null;

  const tone =
    variant === "header"
      ? "text-white hover:opacity-80"
      : "text-primary hover:text-terracotta";
  const size = variant === "header" ? 16 : 20;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {items.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={links[key] as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            tone,
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm",
          )}
        >
          <Icon size={size} aria-hidden />
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds (component is unused so far; that's fine).

- [ ] **Step 3: Commit**

```bash
git add components/SocialIcons.tsx
git commit -m "feat(settings): add shared SocialIcons component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Wire icons into Header + Footer

**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Header — imports + fetch**

In `components/layout/Header.tsx`, add these imports near the top:
```tsx
import { SocialIcons } from "@/components/SocialIcons";
import { getSocialSettings } from "@/lib/social";
```
Inside the `Header` component, right after `const t = await getTranslations("nav");`, add:
```tsx
  const socials = await getSocialSettings();
```

- [ ] **Step 2: Header — replace the Facebook text link**

Find this block in the utility bar:
```tsx
          {/* Facebook – always visible */}
          <a
            href={ORG.facebook}
            className="text-white hover:underline"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
```
Replace it ENTIRELY with:
```tsx
          {/* Social icons – always visible */}
          <SocialIcons variant="header" links={socials} />
```
(Leave the `ORG` import — it is still used elsewhere in the header for email/phone/shortName.)

- [ ] **Step 3: Footer — make async + fetch**

In `components/layout/Footer.tsx`, add imports near the top:
```tsx
import { SocialIcons } from "@/components/SocialIcons";
import { getSocialSettings } from "@/lib/social";
```
Change the declaration `export function Footer() {` to:
```tsx
export async function Footer() {
  const socials = await getSocialSettings();
```

- [ ] **Step 4: Footer — render icons in the brand column**

In the brand column, the tagline paragraph looks like:
```tsx
          <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
            {ORG.tagline}
          </p>
```
Immediately AFTER that `</p>`, add:
```tsx
          <SocialIcons variant="footer" links={socials} className="mt-4" />
```

- [ ] **Step 5: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds.

- [ ] **Step 6: Manual check**

Run `pnpm dev`, open `/`: header utility bar shows Facebook + Instagram icons (default seed), footer brand column shows the same. LinkedIn is absent (no default URL).

- [ ] **Step 7: Commit**

```bash
git add components/layout/Header.tsx components/layout/Footer.tsx
git commit -m "feat(settings): render social icons in header and footer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Server action — `actions/cms/settings.ts`

**Files:**
- Create: `actions/cms/settings.ts`

- [ ] **Step 1: Create the file with EXACTLY this content**

```ts
"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/server";

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), {
    message: "Zadejte platnou URL začínající http(s)://",
  });

const settingsInput = z.object({
  facebookUrl: urlOrEmpty,
  instagramUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
});

function nullify(v: string): string | null {
  return v === "" ? null : v;
}

export async function updateSocialSettings(raw: unknown) {
  await requireAdmin();
  const data = settingsInput.parse(raw);
  const values = {
    facebookUrl: nullify(data.facebookUrl),
    instagramUrl: nullify(data.instagramUrl),
    linkedinUrl: nullify(data.linkedinUrl),
  };
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...values },
    update: values,
  });
  revalidatePath("/", "layout");
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add actions/cms/settings.ts
git commit -m "feat(settings): add updateSocialSettings server action

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Admin page + form + sidebar nav

**Files:**
- Create: `app/[locale]/(admin)/settings/page.tsx`
- Create: `components/admin/SocialSettingsForm.tsx`
- Modify: `components/admin/sidebar.tsx`

- [ ] **Step 1: Create the form** `components/admin/SocialSettingsForm.tsx` with EXACTLY this content:

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSocialSettings } from "@/actions/cms/settings";

type Values = {
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
};

export function SocialSettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [loading, setLoading] = useState(false);

  function set(key: keyof Values) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSocialSettings(values);
      toast.success("Nastavení uloženo.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Uložení selhalo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[var(--radius-md)] border border-border bg-surface p-6"
    >
      <div className="space-y-1">
        <Label htmlFor="facebookUrl">Facebook</Label>
        <Input
          id="facebookUrl"
          type="url"
          placeholder="https://www.facebook.com/…"
          value={values.facebookUrl}
          onChange={set("facebookUrl")}
          disabled={loading}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="instagramUrl">Instagram</Label>
        <Input
          id="instagramUrl"
          type="url"
          placeholder="https://www.instagram.com/…"
          value={values.instagramUrl}
          onChange={set("instagramUrl")}
          disabled={loading}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="linkedinUrl">LinkedIn</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://www.linkedin.com/…"
          value={values.linkedinUrl}
          onChange={set("linkedinUrl")}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Ukládání…" : "Uložit"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Create the page** `app/[locale]/(admin)/settings/page.tsx` with EXACTLY this content:

```tsx
import { getSocialSettings } from "@/lib/social";
import { SocialSettingsForm } from "@/components/admin/SocialSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const socials = await getSocialSettings();
  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Nastavení</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Odkazy na sociální sítě zobrazené v hlavičce a patičce webu.
      </p>
      <div className="mt-6 max-w-xl">
        <SocialSettingsForm
          initial={{
            facebookUrl: socials.facebook ?? "",
            instagramUrl: socials.instagram ?? "",
            linkedinUrl: socials.linkedin ?? "",
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add the sidebar nav item**

In `components/admin/sidebar.tsx`, change the lucide import line:
```tsx
import { LayoutDashboard, FileText, Image, Users } from "lucide-react";
```
to:
```tsx
import { LayoutDashboard, FileText, Image, Users, Settings } from "lucide-react";
```
And add an entry to the `NAV` array (last item):
```tsx
  { href: "/settings", label: "Nastavení", icon: Settings },
```

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm build`
Expected: succeeds; `/[locale]/settings` appears in the route list.

- [ ] **Step 5: Manual check** (requires the migration applied + an admin login)

Run `pnpm dev`, log in as admin, open `/settings`: the three URL fields are prefilled (Facebook + Instagram from defaults, LinkedIn empty). Change a value and click "Uložit" → success toast; the singleton row is created/updated. Add a LinkedIn URL → its icon now appears in header/footer. Clear the Facebook field and save → the Facebook icon disappears (default does not resurrect).

- [ ] **Step 6: Commit**

```bash
git add "app/[locale]/(admin)/settings/page.tsx" components/admin/SocialSettingsForm.tsx components/admin/sidebar.tsx
git commit -m "feat(settings): add admin social-links settings page and nav

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Final verification (after all tasks)
- [ ] `pnpm lint && pnpm build` clean.
- [ ] Migration `add_site_settings` exists under `prisma/migrations/`.
- [ ] Header + footer render Facebook + Instagram icons by default.
- [ ] Admin `/settings` edits persist and reflect site-wide after save; cleared fields hide icons; LinkedIn shows once a URL is set.

## Self-review notes (spec coverage)
- Spec §1 model → Task 1. §2 read layer → Task 2. §3 SocialIcons → Task 3. §4 placement → Task 4. §5 admin (page/form/action/nav) → Tasks 5 + 6. §6 cleanup (header stops referencing ORG.facebook directly) → Task 4 Step 2.
- Type/name consistency: `SocialLinks`, `DEFAULT_SOCIALS`, `getSocialSettings` (Task 2) used identically in Tasks 3/4/6; `updateSocialSettings` (Task 5) imported in Task 6; singleton id `"singleton"` consistent across Tasks 1/2/5.
- No test framework introduced (intentional).
