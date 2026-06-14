# Endorsements CMS ("Spokojení klienti") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins manage the home page "Spokojení klienti" endorsements through the existing CMS, the same way blog posts and FAQ entries are managed, and render that section from the database.

**Architecture:** Add an `ENDORSEMENT` value to the existing `ContentType` enum and reuse the single `Content` model — name in `title`, quote in `body`, optional photo in `coverImage`, and `{ order, role, location, rating, consent }` in the `data` JSON column. Management happens in the unified `/content` list and form. The home `Testimonials` component becomes data-driven, fed by the home page via a try/catch fetch, matching the existing `BlogTeasers` pattern.

**Tech Stack:** Next.js (App Router, server components, `force-dynamic`), Prisma 7 (Postgres via `@prisma/adapter-pg`), Zod, better-auth (`requireAdmin`), UploadThing (`mediaImage` route), Tailwind. No unit-test runner exists; verification is `pnpm lint`, `pnpm build` (runs `prisma generate && next build`), and a standalone `tsx` script for pure logic.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `prisma/schema.prisma` | Add `ENDORSEMENT` to `ContentType` enum | Modify |
| `prisma/migrations/<ts>_add_endorsement_type/migration.sql` | Additive enum migration | Create (via `db:migrate`) |
| `lib/cms/schemas.ts` | `endorsementData` schema + discriminated wiring + enum value | Modify |
| `lib/cms/endorsements.ts` | `getEndorsements()` read helper + `EndorsementItem` type | Create |
| `scripts/verify-endorsement-schema.ts` | Standalone check of schema + mapping (pure, no DB) | Create |
| `actions/cms/content.ts` | Revalidate home (`/`) for `ENDORSEMENT` | Modify |
| `components/cms/content-form.tsx` | Type option, endorsement fields, photo uploader | Modify |
| `app/[locale]/(admin)/content/[id]/edit/page.tsx` | Parse endorsement data into form initial values | Modify |
| `components/home/Testimonials.tsx` | Render endorsements from props | Modify |
| `app/[locale]/page.tsx` | Fetch endorsements, pass to `Testimonials` | Modify |
| `scripts/seed-content.ts` | Seed the three current testimonials | Modify |

---

## Task 1: Add `ENDORSEMENT` content type to the schema and migrate

**Files:**
- Modify: `prisma/schema.prisma:87-91` (the `ContentType` enum)

- [ ] **Step 1: Add the enum value**

In `prisma/schema.prisma`, change the `ContentType` enum to:

```prisma
enum ContentType {
  BLOG_POST
  FAQ
  PAGE
  ENDORSEMENT
}
```

Also update the comment on the `Content.title` / `Content.body` / `Content.data` fields to mention endorsements. Change the three field comments to:

```prisma
  title           String // BLOG_POST: headline · FAQ: question · ENDORSEMENT: client name
  excerpt         String?       @db.Text
  body            String        @db.Text // TipTap HTML · FAQ: answer · ENDORSEMENT: quote
  coverImage      String? // BLOG_POST: cover · ENDORSEMENT: client photo
  metaTitle       String?
  metaDescription String?       @db.Text
  ogImage         String?
  data            Json? // FAQ: { order, category } · ENDORSEMENT: { order, role, location?, rating, consent }
```

- [ ] **Step 2: Generate the migration**

Run: `pnpm db:migrate --name add_endorsement_type`
Expected: Prisma creates `prisma/migrations/<timestamp>_add_endorsement_type/migration.sql` containing `ALTER TYPE "ContentType" ADD VALUE 'ENDORSEMENT';` and reports "Your database is now in sync with your schema." It also regenerates the client into `lib/generated/prisma`.

If the dev database is not reachable, instead run `pnpm db:generate` to regenerate the client from the edited schema and create the migration later with `db:migrate` when the DB is available. Note this in the commit message.

- [ ] **Step 3: Verify the generated client knows the value**

Run: `grep -r "ENDORSEMENT" lib/generated/prisma/ | head`
Expected: at least one match (the regenerated enum), confirming `prisma generate` ran.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/migrations lib/generated/prisma
git commit -m "feat(db): add ENDORSEMENT content type"
```

---

## Task 2: Add the `endorsementData` validation schema

**Files:**
- Modify: `lib/cms/schemas.ts`

- [ ] **Step 1: Add `ENDORSEMENT` to the type enum**

In `lib/cms/schemas.ts`, change line 3:

```ts
export const ContentTypeEnum = z.enum(["BLOG_POST", "FAQ", "PAGE", "ENDORSEMENT"]);
```

- [ ] **Step 2: Add the `endorsementData` schema**

After the existing `faqData` block (after the `export type FaqData` line), add:

```ts
/** Endorsement structured payload — testimonial metadata for "Spokojení klienti". */
export const endorsementData = z.object({
  order: z.number().int().min(0).default(0),
  role: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  consent: z.boolean().default(false),
});

export type EndorsementData = z.infer<typeof endorsementData>;
```

- [ ] **Step 3: Wire it into the discriminated validator**

In `contentInputDiscriminated`, add an `ENDORSEMENT` branch mirroring the FAQ one. The full block becomes:

```ts
/** Validate the per-type `data` JSON, mapping issues onto the `data.*` path. */
export const contentInputDiscriminated = contentInput.superRefine((val, ctx) => {
  if (val.type === "FAQ" && val.data != null) {
    const r = faqData.safeParse(val.data);
    if (!r.success) {
      for (const issue of r.error.issues) {
        ctx.addIssue({ ...issue, path: ["data", ...issue.path] });
      }
    }
  }
  if (val.type === "ENDORSEMENT" && val.data != null) {
    const r = endorsementData.safeParse(val.data);
    if (!r.success) {
      for (const issue of r.error.issues) {
        ctx.addIssue({ ...issue, path: ["data", ...issue.path] });
      }
    }
  }
  // BLOG_POST and PAGE carry no required structured data.
});
```

- [ ] **Step 4: Verify it type-checks**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `lib/cms/schemas.ts`. (Pre-existing errors elsewhere, if any, are unrelated.)

- [ ] **Step 5: Commit**

```bash
git add lib/cms/schemas.ts
git commit -m "feat(cms): add endorsement validation schema"
```

---

## Task 3: Add the `getEndorsements` read helper

**Files:**
- Create: `lib/cms/endorsements.ts`

- [ ] **Step 1: Create the read helper**

Create `lib/cms/endorsements.ts`, mirroring `lib/cms/faq.ts`:

```ts
import db from "@/lib/db";
import { endorsementData } from "@/lib/cms/schemas";

export type EndorsementItem = {
  id: string;
  name: string;
  quote: string;
  role?: string;
  location?: string;
  rating: number;
  photo?: string;
  order: number;
};

export function toEndorsementItem(row: {
  id: string;
  title: string;
  body: string;
  coverImage: string | null;
  data: unknown;
}): EndorsementItem {
  const parsed = endorsementData.safeParse(row.data);
  const meta = parsed.success
    ? parsed.data
    : { order: 0, rating: 5, consent: false };
  return {
    id: row.id,
    name: row.title,
    quote: row.body,
    role: "role" in meta ? meta.role : undefined,
    location: "location" in meta ? meta.location : undefined,
    rating: meta.rating ?? 5,
    photo: row.coverImage ?? undefined,
    order: meta.order ?? 0,
  };
}

export async function getEndorsements(locale: string): Promise<EndorsementItem[]> {
  const rows = await db.content.findMany({
    where: { type: "ENDORSEMENT", status: "PUBLISHED", locale },
    orderBy: [{ createdAt: "asc" }],
    select: { id: true, title: true, body: true, coverImage: true, data: true },
  });
  return rows.map(toEndorsementItem).sort((a, b) => a.order - b.order);
}
```

- [ ] **Step 2: Create the standalone verification script**

Create `scripts/verify-endorsement-schema.ts` (no DB; checks pure logic):

```ts
/**
 * Standalone check for the endorsement schema + row mapping.
 * Run: pnpm exec tsx scripts/verify-endorsement-schema.ts
 */
import { endorsementData } from "../lib/cms/schemas";
import { toEndorsementItem } from "../lib/cms/endorsements";
import assert from "node:assert/strict";

// Defaults apply when fields are missing.
const d = endorsementData.parse({});
assert.equal(d.order, 0);
assert.equal(d.rating, 5);
assert.equal(d.consent, false);

// Rating bounds are enforced.
assert.equal(endorsementData.safeParse({ rating: 6 }).success, false);
assert.equal(endorsementData.safeParse({ rating: 0 }).success, false);
assert.equal(endorsementData.safeParse({ rating: 3 }).success, true);

// Row mapping pulls name/quote/photo from columns and rating/role from data.
const item = toEndorsementItem({
  id: "c1",
  title: "Alena",
  body: "Skvělá pomoc.",
  coverImage: "https://example.com/a.jpg",
  data: { order: 2, role: "Maminka", location: "Brno", rating: 4, consent: true },
});
assert.equal(item.name, "Alena");
assert.equal(item.quote, "Skvělá pomoc.");
assert.equal(item.photo, "https://example.com/a.jpg");
assert.equal(item.rating, 4);
assert.equal(item.role, "Maminka");
assert.equal(item.location, "Brno");
assert.equal(item.order, 2);

// Bad/missing data falls back to safe defaults (no throw).
const fallback = toEndorsementItem({
  id: "c2",
  title: "Jana",
  body: "Děkuji.",
  coverImage: null,
  data: null,
});
assert.equal(fallback.rating, 5);
assert.equal(fallback.photo, undefined);
assert.equal(fallback.order, 0);

console.log("✓ endorsement schema + mapping OK");
```

- [ ] **Step 3: Run the verification script**

Run: `pnpm exec tsx scripts/verify-endorsement-schema.ts`
Expected: prints `✓ endorsement schema + mapping OK` and exits 0. (This imports `lib/db` transitively through `endorsements.ts`, but `toEndorsementItem` and `endorsementData` do not call the DB, so no connection is needed.)

- [ ] **Step 4: Commit**

```bash
git add lib/cms/endorsements.ts scripts/verify-endorsement-schema.ts
git commit -m "feat(cms): add endorsements read helper with verification"
```

---

## Task 4: Revalidate the home page when endorsements change

**Files:**
- Modify: `actions/cms/content.ts:24-32` (the `revalidatePublic` function)

- [ ] **Step 1: Add the `ENDORSEMENT` revalidation branch**

In `actions/cms/content.ts`, update `revalidatePublic` so it revalidates the home page for endorsements. `publicPathFor` already returns `null` for `ENDORSEMENT` (no detail page), so only add the home revalidation:

```ts
function revalidatePublic(type: ContentInput["type"], slug: string) {
  const p = publicPathFor(type, slug);
  if (p) revalidatePath(p);
  if (type === "BLOG_POST") {
    revalidatePath("/blog");
    revalidatePath("/"); // home "Novinky z blogu" teasers
  }
  if (type === "FAQ") revalidatePath("/faq");
  if (type === "ENDORSEMENT") revalidatePath("/"); // home "Spokojení klienti"
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `actions/cms/content.ts`.

- [ ] **Step 3: Commit**

```bash
git add actions/cms/content.ts
git commit -m "feat(cms): revalidate home on endorsement changes"
```

---

## Task 5: Add endorsement fields and a photo uploader to the content form

**Files:**
- Modify: `components/cms/content-form.tsx` (full rewrite below)

- [ ] **Step 1: Rewrite the form with endorsement support**

Replace the entire contents of `components/cms/content-form.tsx` with:

```tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createContent, updateContent } from "@/actions/cms/content";
import { useUploadThing } from "@/lib/uploadthing/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ContentValues = {
  id?: string;
  type: "BLOG_POST" | "FAQ" | "PAGE" | "ENDORSEMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  order: number;
  category: string;
  // Endorsement-only
  role: string;
  location: string;
  rating: number;
  consent: boolean;
  coverImage: string;
};

const EMPTY: ContentValues = {
  type: "BLOG_POST",
  status: "DRAFT",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  metaTitle: "",
  metaDescription: "",
  order: 0,
  category: "",
  role: "",
  location: "",
  rating: 5,
  consent: false,
  coverImage: "",
};

export function ContentForm({ initial }: { initial?: Partial<ContentValues> }) {
  const router = useRouter();
  const [v, setV] = useState<ContentValues>({ ...EMPTY, ...initial });
  const [pending, start] = useTransition();
  const set = <K extends keyof ContentValues>(k: K, val: ContentValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));

  const { startUpload, isUploading } = useUploadThing("mediaImage", {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl ?? res?.[0]?.url;
      if (url) {
        set("coverImage", url);
        toast.success("Fotografie nahrána.");
      }
    },
    onUploadError: (e) => toast.error(e.message || "Nahrání selhalo."),
  });

  function save() {
    start(async () => {
      const payload = {
        type: v.type,
        status: v.status,
        locale: "cs",
        slug: v.slug,
        title: v.title,
        excerpt: v.excerpt || null,
        body: v.body,
        coverImage: v.coverImage || null,
        metaTitle: v.metaTitle || null,
        metaDescription: v.metaDescription || null,
        data:
          v.type === "FAQ"
            ? { order: Number(v.order) || 0, category: v.category || undefined }
            : v.type === "ENDORSEMENT"
              ? {
                  order: Number(v.order) || 0,
                  role: v.role || undefined,
                  location: v.location || undefined,
                  rating: Number(v.rating) || 5,
                  consent: v.consent,
                }
              : null,
      };
      try {
        if (v.id) {
          await updateContent(v.id, payload);
          toast.success("Uloženo.");
          router.refresh();
        } else {
          await createContent(payload); // redirects to edit
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Uložení selhalo.");
      }
    });
  }

  const isFaq = v.type === "FAQ";
  const isEndorsement = v.type === "ENDORSEMENT";

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="type">Typ</Label>
          <select
            id="type"
            value={v.type}
            onChange={(e) => set("type", e.target.value as ContentValues["type"])}
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border px-3"
          >
            <option value="BLOG_POST">Blog</option>
            <option value="FAQ">FAQ</option>
            <option value="PAGE">Stránka</option>
            <option value="ENDORSEMENT">Reference</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="status">Stav</Label>
          <select
            id="status"
            value={v.status}
            onChange={(e) =>
              set("status", e.target.value as ContentValues["status"])
            }
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border px-3"
          >
            <option value="DRAFT">Koncept</option>
            <option value="PUBLISHED">Publikováno</option>
            <option value="ARCHIVED">Archivováno</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">
          {isFaq ? "Otázka" : isEndorsement ? "Jméno klienta" : "Nadpis"}
        </Label>
        <Input id="title" value={v.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" value={v.slug} onChange={(e) => set("slug", e.target.value)} />
      </div>

      {!isFaq && !isEndorsement && (
        <div className="space-y-1">
          <Label htmlFor="excerpt">Perex</Label>
          <Textarea
            id="excerpt"
            value={v.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
      )}

      {isFaq && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="order">Pořadí</Label>
            <Input
              id="order"
              type="number"
              value={v.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Kategorie</Label>
            <Input
              id="category"
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
        </div>
      )}

      {isEndorsement && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="role">Role / popis</Label>
              <Input
                id="role"
                value={v.role}
                onChange={(e) => set("role", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="location">Město (nepovinné)</Label>
              <Input
                id="location"
                value={v.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="order">Pořadí</Label>
              <Input
                id="order"
                type="number"
                value={v.order}
                onChange={(e) => set("order", Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="rating">Hodnocení (1–5)</Label>
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={v.rating}
                onChange={(e) => set("rating", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Fotografie (nepovinné)</Label>
            <div className="flex items-center gap-4">
              {v.coverImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.coverImage}
                    alt=""
                    className="h-14 w-14 rounded-full border border-border object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => set("coverImage", "")}
                  >
                    Odebrat
                  </Button>
                </>
              ) : (
                <Input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) startUpload([file]);
                  }}
                />
              )}
              {isUploading && (
                <span className="text-sm text-ink-muted">Nahrávám…</span>
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={v.consent}
              onChange={(e) => set("consent", e.target.checked)}
            />
            Klient souhlasil se zveřejněním
          </label>
        </>
      )}

      <div className="space-y-1">
        <Label htmlFor="body">
          {isFaq ? "Odpověď" : isEndorsement ? "Citace" : "Obsah"}
          {!isEndorsement && " (HTML)"}
        </Label>
        {/* TODO: replace with TipTap editor (components/cms/tiptap-editor). */}
        <Textarea
          id="body"
          rows={isEndorsement ? 5 : 12}
          value={v.body}
          onChange={(e) => set("body", e.target.value)}
        />
      </div>

      {!isEndorsement && (
        <details className="rounded-[var(--radius-sm)] border border-border p-3">
          <summary className="cursor-pointer text-sm font-medium">SEO</summary>
          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input
                id="metaTitle"
                value={v.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="metaDescription">Meta description</Label>
              <Textarea
                id="metaDescription"
                value={v.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
            </div>
          </div>
        </details>
      )}

      <Button onClick={save} disabled={pending || isUploading}>
        {pending ? "Ukládám…" : "Uložit"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Confirm the `Button` component supports `variant="outline"`**

Run: `grep -n "outline" components/ui/button.tsx`
Expected: a match in the `variant` definitions. If there is no `outline` variant, change the "Odebrat" button to use the default variant (remove the `variant="outline"` prop).

- [ ] **Step 3: Verify it type-checks and lints**

Run: `pnpm exec tsc --noEmit -p tsconfig.json && pnpm lint`
Expected: no errors referencing `components/cms/content-form.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/cms/content-form.tsx
git commit -m "feat(cms): add endorsement fields and photo upload to content form"
```

---

## Task 6: Pass endorsement data into the edit form

**Files:**
- Modify: `app/[locale]/(admin)/content/[id]/edit/page.tsx`

- [ ] **Step 1: Parse endorsement data and extend `initial`**

Replace the contents of `app/[locale]/(admin)/content/[id]/edit/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { ContentForm } from "@/components/cms/content-form";
import { faqData, endorsementData } from "@/lib/cms/schemas";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await db.content.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();

  const faq = faqData.safeParse(row.data);
  const end = endorsementData.safeParse(row.data);

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Upravit obsah</h1>
      <div className="mt-6">
        <ContentForm
          initial={{
            id: row.id,
            type: row.type,
            status: row.status,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt ?? "",
            body: row.body,
            metaTitle: row.metaTitle ?? "",
            metaDescription: row.metaDescription ?? "",
            coverImage: row.coverImage ?? "",
            order: faq.success
              ? (faq.data.order ?? 0)
              : end.success
                ? (end.data.order ?? 0)
                : 0,
            category: faq.success ? (faq.data.category ?? "") : "",
            role: end.success ? (end.data.role ?? "") : "",
            location: end.success ? (end.data.location ?? "") : "",
            rating: end.success ? (end.data.rating ?? 5) : 5,
            consent: end.success ? end.data.consent : false,
          }}
        />
      </div>
    </div>
  );
}
```

Note: `endorsementData` applies defaults, so `end.success` is true even for non-endorsement rows; that is harmless because the form ignores these fields unless `type === "ENDORSEMENT"`.

- [ ] **Step 2: Verify it type-checks**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors referencing the edit page.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/(admin)/content/[id]/edit/page.tsx"
git commit -m "feat(cms): load endorsement fields into the edit form"
```

---

## Task 7: Render the home "Spokojení klienti" section from data

**Files:**
- Modify: `components/home/Testimonials.tsx` (full rewrite below)

- [ ] **Step 1: Make the component data-driven**

Replace the entire contents of `components/home/Testimonials.tsx` with:

```tsx
import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { EndorsementItem } from "@/lib/cms/endorsements";

export function Testimonials({ items }: { items: EndorsementItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <Container>
        <h2 className="font-heading text-4xl text-ink text-center mb-16">
          Spokojení klienti
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t) => {
            const rating = Math.min(5, Math.max(1, t.rating));
            const subtitle = [t.role, t.location].filter(Boolean).join(" · ");
            return (
              <div
                key={t.id}
                className="p-8 rounded-2xl border border-hairline bg-surface-subtle"
              >
                <div
                  className="flex text-primary mb-4"
                  aria-label={`${rating} hvězdiček z 5`}
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="italic text-ink mb-8 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.photo}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-peach flex items-center justify-center font-bold text-terracotta shrink-0"
                      aria-hidden="true"
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{t.name}</p>
                    {subtitle && (
                      <p className="text-xs text-ink-muted">{subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: an error in `app/[locale]/page.tsx` that `Testimonials` now requires an `items` prop. That is expected and fixed in Task 8. No errors inside `Testimonials.tsx` itself.

- [ ] **Step 3: Commit**

```bash
git add components/home/Testimonials.tsx
git commit -m "feat(home): render Spokojení klienti from endorsements data"
```

---

## Task 8: Fetch endorsements on the home page

**Files:**
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: Import the read helper**

In `app/[locale]/page.tsx`, add this import alongside the existing `getLatestPosts` import:

```tsx
import { getEndorsements } from "@/lib/cms/endorsements";
```

- [ ] **Step 2: Fetch endorsements with a try/catch**

After the existing `latest` fetch block (the `try { latest = await getLatestPosts(...) } catch {}`), add:

```tsx
  let endorsements: Awaited<ReturnType<typeof getEndorsements>> = [];
  try {
    endorsements = await getEndorsements(locale);
  } catch {
    // DB not connected yet — render without testimonials.
  }
```

- [ ] **Step 3: Pass the prop**

Change the `<Testimonials />` usage to:

```tsx
        <Testimonials items={endorsements} />
```

- [ ] **Step 4: Verify it type-checks**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no errors referencing `app/[locale]/page.tsx` or `Testimonials`.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/page.tsx"
git commit -m "feat(home): fetch endorsements for Spokojení klienti section"
```

---

## Task 9: Seed the three current testimonials

**Files:**
- Modify: `scripts/seed-content.ts`

- [ ] **Step 1: Add the endorsement seed data and upsert loop**

In `scripts/seed-content.ts`, add an `ENDORSEMENTS` constant after the `POSTS` constant:

```ts
const ENDORSEMENTS = [
  {
    slug: "alena",
    name: "Alena",
    role: "Maminka na mateřské",
    quote:
      "Díky SOS výživné se mi konečně podařilo získat dlužné alimenty za dva roky. Celý proces byl neuvěřitelně hladký a lidský.",
    order: 1,
  },
  {
    slug: "frantisek",
    name: "František",
    role: "Otec samoživitel",
    quote:
      "Profesionální přístup a jasná komunikace. Pomohli mi v momentě, kdy jsem už ztrácel naději na férové vyrovnání.",
    order: 2,
  },
  {
    slug: "jana",
    name: "Jana",
    role: "Zaměstnaná maminka",
    quote:
      "Nejdřív jsem se bála poplatků, ale opravdu je vše zdarma. Doporučuji každému, kdo bojuje s neplatiči.",
    order: 3,
  },
];
```

Then, inside `main()`, after the `POSTS` upsert loop (before `await db.$disconnect()`), add:

```ts
  for (const e of ENDORSEMENTS) {
    await db.content.upsert({
      where: {
        type_locale_slug: { type: "ENDORSEMENT", locale: "cs", slug: e.slug },
      },
      update: {},
      create: {
        type: "ENDORSEMENT",
        status: "PUBLISHED",
        locale: "cs",
        slug: e.slug,
        title: e.name,
        body: e.quote,
        data: { order: e.order, role: e.role, rating: 5, consent: true },
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
    console.log(`✓ endorsement: ${e.slug}`);
  }
```

- [ ] **Step 2: Run the seed (requires a database and a seeded admin)**

Run: `pnpm seed:content`
Expected: prints `✓ endorsement: alena`, `✓ endorsement: frantisek`, `✓ endorsement: jana` (alongside the FAQ/post lines). If the DB is unavailable, skip this step and note it; the seed is idempotent (upsert) and can run later.

- [ ] **Step 3: Commit**

```bash
git add scripts/seed-content.ts
git commit -m "feat(seed): seed the three current testimonials as endorsements"
```

---

## Task 10: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Lint the whole project**

Run: `pnpm lint`
Expected: passes with no errors.

- [ ] **Step 2: Type-check / build**

Run: `pnpm exec tsc --noEmit -p tsconfig.json`
Expected: no new errors from any file touched in this plan.

- [ ] **Step 3: Manual smoke test (requires DB + `pnpm dev`)**

With `pnpm dev` running and logged in as an admin:
1. Go to `/content`, click **+ Nový obsah**, choose type **Reference**. Fill name, slug, quote, role, rating 5, optionally upload a photo, set status **Publikováno**, save.
2. Confirm the new row appears in `/content` with type `ENDORSEMENT`.
3. Open it via the edit link — confirm name, quote, role, rating, consent, and photo round-trip correctly.
4. Visit `/` — confirm the new endorsement renders in "Spokojení klienti" with the right star count and photo/initial.
5. Set the endorsement to **Koncept** (draft), save, reload `/` — confirm it disappears.

Expected: all five steps behave as described.

- [ ] **Step 4: Final commit (if any verification fixups were needed)**

```bash
git add -A
git commit -m "chore(endorsements): verification fixups" || echo "nothing to commit"
```

---

## Self-Review Notes

- **Spec coverage:** data model (Task 1), validation (Task 2), read helper (Task 3), actions/revalidation (Task 4), admin form incl. photo + consent + location + rating (Task 5), edit page (Task 6), home rendering (Task 7) + fetch (Task 8), seed (Task 9). All spec sections mapped.
- **Type consistency:** `EndorsementItem` (`name, quote, role, location, rating, photo, order`) defined in Task 3 and consumed unchanged in Task 7; `toEndorsementItem` named identically in Tasks 3 and the verification script; `endorsementData` fields (`order, role, location, rating, consent`) identical across Tasks 2, 3, 5, 6, 9.
- **No public detail page:** `publicPathFor` intentionally returns `null` for `ENDORSEMENT`; slug exists only to satisfy the unique constraint.
