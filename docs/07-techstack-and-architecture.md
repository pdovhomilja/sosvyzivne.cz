# 07 — Tech Stack & App Architecture (adopt from aqunama.com-v2)

This is the **chosen technical blueprint** for the SOSvyzivne.cz rebuild, copied from the sibling
project **`aqunama.com-v2`** (a Next.js 16 + Prisma + better-auth marketing site with a full custom
CMS admin). It is a proven, production pattern: an i18n public marketing site plus a gated admin where
non-technical staff manage content. We reuse it wholesale and adapt the content model + routes to
SOSvyzivne.

> This **supersedes** the "MDX-first, CMS-optional" suggestion in `05-nextjs-architecture.md` §Content
> model. The decision is now: **database-backed CMS with an admin panel** (see reconciliation note at
> the end of `05`). Keep everything else in `05` (rendering strategy, lead form, calculator, SEO).

---

## 1. Tech stack (exact, from aqunama `package.json`)

| Layer | Package | Version | Purpose |
|-------|---------|---------|---------|
| Framework | `next` | **16.2.6** | App Router, RSC, server actions |
| UI runtime | `react` / `react-dom` | **19.2.4** | |
| Language | `typescript` | ^5 | strict |
| Node | engine | **>=22.12** (`.nvmrc`) | |
| i18n | `next-intl` | ^4.12 | locale routing + message catalogs |
| ORM | `prisma` / `@prisma/client` | **^7.8** | schema + generated client |
| DB driver | `@prisma/adapter-pg` + `pg` | | PostgreSQL via driver adapter |
| Auth | `better-auth` | ^1.6 | email-OTP passwordless, sessions |
| Styling | `tailwindcss` | **v4** (`@tailwindcss/postcss`) | + `tw-animate-css` |
| UI primitives | `@radix-ui/*` | | dialog, dropdown, select, label, avatar, separator, toast, slot |
| Variants | `class-variance-authority`, `clsx`, `tailwind-merge` | | shadcn-style `cn()` |
| Icons | `lucide-react` | | |
| Forms | `react-hook-form` + `@hookform/resolvers` + `zod`^4 | | validation shared client/server |
| Rich text | `@tiptap/*` (react, starter-kit, link, underline, heading) | | admin WYSIWYG body editor |
| Tables | `@tanstack/react-table` | | admin lists (users, content) |
| Uploads | `uploadthing` + `@uploadthing/react` | ^7 | media library |
| Email | `resend` | ^6 | transactional (OTP, contact) |
| Toasts | `sonner` | | |
| Analytics | `posthog-js` | | consent-gated |
| AI (optional) | `ai` (Vercel AI SDK) + `@ai-sdk/{google,openai,perplexity,togetherai,xai}` | | admin authoring helpers (draft, rewrite, translate, SEO, cover image) |
| Anti-spam | Cloudflare Turnstile (`lib/turnstile.ts`) | | contact form |
| Tests/a11y | `playwright`, `@axe-core/playwright`, `pixelmatch` | | visual-diff + a11y scripts |

**Package manager:** pnpm (`pnpm-lock.yaml`; `onlyBuiltDependencies` allowlist for native deps).
**Build:** `prisma generate && next build`. Prisma client is generated to `lib/generated/prisma`
(checked-in path, imported as `@/lib/generated/prisma/client`).

> Per both projects' `AGENTS.md`: this Next.js version has breaking changes — read
> `node_modules/next/dist/docs/` before coding. Note aqunama uses `proxy.ts` (not `middleware.ts`) for
> next-intl middleware — a Next 16 convention. Mirror whatever the installed version documents.

---

## 2. Top-level project layout

```
app/                 # App Router (see §3)
actions/             # "use server" server actions, grouped: actions/cms/*, actions/ai/*
components/
  ├─ admin/          # sidebar, topbar (admin chrome)
  ├─ cms/            # content-form, tiptap-editor, media-library, users-table, ai-toolbar, image-picker…
  ├─ sections/       # public page sections
  ├─ templates/      # public page templates
  └─ ui/             # shadcn-style primitives (button, input, dialog, select, sonner…)
i18n/                # routing.ts, request.ts, navigation.ts
lib/
  ├─ auth/           # config.ts (better-auth), server.ts (guards), client.ts (react client)
  ├─ admin/          # admin-emails.ts (bootstrap allowlist)
  ├─ cms/            # data access + zod schemas per content type
  ├─ email/          # resend client + templates
  ├─ ai/             # provider registry + availability
  ├─ seo/            # metadata.ts (OG/Twitter builder)
  ├─ uploadthing/    # client + server helpers
  ├─ generated/      # prisma client (build artifact)
  ├─ db.ts           # singleton PrismaClient (pg adapter)
  ├─ consent.ts, turnstile.ts, utils.ts
messages/            # cs.json, en.json (next-intl catalogs)
prisma/              # schema.prisma + migrations/
scripts/             # seed-admins, migrate/*, translate, a11y, visual-diff
proxy.ts             # next-intl middleware (Next 16 "proxy" file)
next.config.ts       # withNextIntl + redirects()
prisma.config.ts
```

Path alias: `@/*` → project root.

---

## 3. App Router structure — public + admin

Everything lives under a single `[locale]` segment; admin and auth are **route groups** (parenthesized
= no URL segment) so they share the locale + i18n but have their own layouts and gating.

```
app/
├─ [locale]/
│  ├─ layout.tsx                 # ROOT locale layout: fonts, <Header/> <Footer/>, providers,
│  │                             #   NextIntlClientProvider, Toaster, analytics, metadataBase, OG
│  │
│  ├─ page.tsx                   # public home
│  ├─ <public-page>/page.tsx     # one folder per public route (about, contact, services…)
│  ├─ <hub>/page.tsx + [slug]/page.tsx   # list + detail (case-studies, news, industries)
│  │
│  ├─ (admin)/                   # ─── ADMIN GROUP (gated) ───
│  │  ├─ layout.tsx              #   calls requireAdmin(); renders AdminSidebar + AdminTopbar
│  │  ├─ dashboard/page.tsx
│  │  ├─ content/page.tsx        #   list (TanStack table)
│  │  ├─ content/new/page.tsx    #   create
│  │  ├─ content/[id]/edit/page.tsx
│  │  ├─ media/page.tsx          #   UploadThing media library
│  │  ├─ users/page.tsx          #   invite / promote / deactivate (RBAC)
│  │  └─ users/audit/page.tsx    #   audit log
│  │
│  └─ (auth)/                    # ─── AUTH GROUP (public) ───
│     ├─ layout.tsx              #   centered card layout
│     └─ login/page.tsx + login-form.tsx   # email-OTP login
│
├─ api/
│  ├─ auth/[...all]/route.ts     # better-auth catch-all (toNextJsHandler)
│  ├─ uploadthing/{core,route}.ts
│  └─ media/list/route.ts
├─ robots.ts
└─ sitemap.ts
```

**Why route groups:** `(admin)` and `(auth)` add no URL prefix (admin lives at `/dashboard`,
`/content`, `/users` — not `/admin/...`), but each gets an isolated `layout.tsx`. The admin layout is
the single choke point for authorization.

### Root locale layout responsibilities (`app/[locale]/layout.tsx`)
- `generateStaticParams()` from `routing.locales`; `notFound()` on bad locale; `setRequestLocale()`.
- Loads fonts via `next/font/google`; sets `<html lang={locale}>`.
- Wraps children in `NextIntlClientProvider`, renders `Header`/`Footer`/`CookieConsent`/analytics,
  `Toaster`, UploadThing SSR plugin.
- `generateMetadata()` sets `metadataBase` + site title/description + `socialMetadata()` OG/Twitter.

---

## 4. Internationalization (next-intl)

```ts
// i18n/routing.ts
export const routing = defineRouting({
  locales: ["en", "cs"],
  defaultLocale: "en",
  localePrefix: "as-needed",   // default locale has no prefix; others prefixed
});
```

- `i18n/request.ts` — `getRequestConfig` loads `messages/${locale}.json`.
- `i18n/navigation.ts` — locale-aware `Link`, `redirect`, `usePathname`, `useRouter`.
- `proxy.ts` — `createMiddleware(routing)` with matcher excluding `api`, `_next`, `_vercel`, files.
- `next.config.ts` — `createNextIntlPlugin("./i18n/request.ts")` wraps the config.
- Messages: `messages/cs.json`, `messages/en.json` (namespaced: `site`, `auth`, …).

**For SOSvyzivne:** set `locales: ["cs"]`, `defaultLocale: "cs"` (Czech-only today; add `en` later by
adding a catalog). Everything else is identical. `<html lang="cs">`, `og:locale=cs_CZ`.

---

## 5. Authentication & authorization (better-auth, passwordless)

**Model:** email **OTP** (6-digit, 5-min expiry, 3 attempts), **sign-up disabled** — only pre-invited
admins can log in. No passwords stored for admins.

```ts
// lib/auth/config.ts  (server)
export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  user: { additionalFields: { isAdmin: { type: "boolean", defaultValue: false, input: false } } },
  session: { expiresIn: 7d, updateAge: 24h },
  plugins: [emailOTP({ otpLength: 6, expiresIn: 300, allowedAttempts: 3, disableSignUp: true,
    sendVerificationOTP })],
});
```

`sendVerificationOTP` **pre-checks the DB**: only sends a code if the user exists AND `isAdmin` AND
`isActive` — otherwise throws "not authorized". The OTP email is sent via Resend
(`lib/email/templates/otp-email.ts`).

```ts
// lib/auth/server.ts  ("server-only") — the authorization guards
getSession()    // wraps auth.api.getSession({ headers })
requireAuth()   // redirect("/login") if no session
requireAdmin()  // requireAuth → check session.user.isAdmin → RE-READ db.user (isAdmin && isActive)
                //   → redirect("/") if not. DB is the source of truth, re-checked every request.
```

```ts
// lib/auth/client.ts  ("use client")
export const authClient = createAuthClient({ baseURL: NEXT_PUBLIC_APP_URL, plugins: [emailOTPClient()] });
export const { useSession, signIn, signOut, emailOtp } = authClient;
```

- API route: `app/api/auth/[...all]/route.ts` → `toNextJsHandler(auth.handler)` exports `GET, POST`.
- Login UX (`login-form.tsx`): two-stage — enter email → receive code → enter 6-digit OTP →
  `router.push("/dashboard")`. Uses sonner toasts + i18n strings.
- **Gating is layout-level**: `(admin)/layout.tsx` awaits `requireAdmin()` before rendering anything,
  and every mutating server action **also** calls `requireAdmin()` (defense in depth — never trust the
  layout alone).

### RBAC + audit
- Roles are simple booleans on `User`: `isAdmin`, `isActive` (no role table). DB is canonical after
  bootstrap.
- **Bootstrap:** `ADMIN_EMAILS` env → `scripts/seed-admins.ts` (`pnpm seed:admins`) creates the first
  admin. After that, admins invite others in-app via `/users`.
- **User management actions** (`actions/cms/users.ts`): `inviteUser`, `toggleAdmin`,
  `deactivateUser` (also deletes their sessions to kill live logins), `reactivateUser`,
  `updateUserName`. Guards: can't change your own role, can't demote/deactivate the **last active
  admin** (`assertNotLastActiveAdmin`).
- Every privileged change writes a `UserAuditLog` row (action, target, actor, meta) → `/users/audit`.

---

## 6. Data model (Prisma — `prisma/schema.prisma`)

PostgreSQL. Generated client → `lib/generated/prisma`. Singleton in `lib/db.ts` (pg driver adapter,
global cache in dev).

**Auth tables (better-auth):** `User`, `Account`, `Session`, `Verification`.
- `User`: `id(cuid)`, `name`, `email @unique`, `emailVerified`, `image?`, **`isAdmin`**, **`isActive`**,
  timestamps; relations to content/media/audit. Indexed on `email` and `[isAdmin, isActive]`.

**CMS tables:**
```prisma
enum ContentType   { NEWS  CASE_STUDY  BLOG_POST  INDUSTRY  PAGE }
enum ContentStatus { DRAFT  PUBLISHED  ARCHIVED }

model Content {
  id, type, status(DRAFT), locale, slug,
  translationKey?,          // links the same item across locales
  title, excerpt?, body(Text), coverImage?,
  metaTitle?, metaDescription?, ogImage?,
  data Json?,               // type-specific structured payload (validated per-type, see §7)
  publishedAt?, authorId→User, tags Tag[],
  @@unique([type, locale, slug])
  @@index([type, status, publishedAt]) @@index([translationKey]) @@index([authorId])
}
model Tag { id, name @unique, contents Content[] }
model MediaAsset { id, url, alt?, mimeType, width?, height?, uploadedBy→User }
enum UserAuditAction { INVITED PROMOTED DEMOTED DEACTIVATED REACTIVATED RENAMED }
model UserAuditLog { id, action, target→User, actor→User, meta Json?, createdAt }
```

The `Content` model is **generic**: one table serves news, case studies, blog posts, industries, and
free-form pages, distinguished by `type` and a JSON `data` blob whose shape is validated per type.
`translationKey` ties translations together; `(type, locale, slug)` is unique.

Migrations live in `prisma/migrations/`. Scripts: `db:migrate` (dev), `db:deploy` (prod), `db:studio`.

---

## 7. Content management pattern (server actions + zod)

**Server actions** in `actions/cms/*.ts` (`"use server"`). Canonical shape (`actions/cms/content.ts`):

```ts
export async function createContent(raw: unknown) {
  const session = await requireAdmin();              // 1. authorize (re-checked, not trusting layout)
  const data = contentInput.parse(raw);              // 2. validate with zod (discriminated by type)
  const row = await db.content.create({ data: { …data, authorId: session.user.id,
    publishedAt: data.status === "PUBLISHED" ? new Date() : null } });
  revalidatePath("/content");                        // 3. revalidate admin + affected public paths
  if (data.status === "PUBLISHED") revalidatePath(publicPathFor(row.type, row.slug));
  redirect(`/content/${row.id}/edit`);
}
// updateContent / deleteContent follow the same authorize → validate → mutate → revalidate shape.
```

**Validation** (`lib/cms/schemas.ts`): a base `contentInput` zod object + `contentInputDiscriminated`
that `superRefine`s the `data` JSON against a per-type schema (`case-study-schema`, `industry-schema`,
`page-schema`), pushing issues onto the `data.*` path so the form shows field-level errors. Slugs are
regex-constrained (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).

**Admin editor UI** (`components/cms/`): `content-form` + `tiptap-editor` (rich body),
`image-picker` / `media-library` (UploadThing), `ai-toolbar` (optional AI authoring),
`translation-link` (link locales), `users-table`, type-specific forms. Public reads go through
`lib/cms/*.ts` data-access modules.

---

## 8. Supporting subsystems

- **Media:** UploadThing. `app/api/uploadthing/{core,route}.ts` define the file router;
  `lib/uploadthing/*` client+server helpers; `MediaAsset` rows track uploads; `media-library` +
  `image-picker` in admin. Root layout mounts `NextSSRPlugin`.
- **Email:** Resend (`lib/email/client.ts` exports `resend` + `EMAIL_FROM`). Templates in
  `lib/email/templates/`. Used for OTP and the contact form.
- **Contact form:** react-hook-form + zod + **Cloudflare Turnstile** (`lib/turnstile.ts`) anti-spam,
  submitted via a server action that sends through Resend. (Maps directly onto SOSvyzivne's "Chci
  pomoc" lead form in `05`.)
- **Analytics:** PostHog, **consent-gated** (`lib/consent.ts` + `CookieConsent` component); only loads
  after the user accepts the Analytics cookie. EU host. Disabled if `NEXT_PUBLIC_POSTHOG_KEY` empty.
- **SEO:** `lib/seo/metadata.ts` `socialMetadata()` builds OG + Twitter consistently with a site-wide
  `/og.jpeg` fallback; `app/sitemap.ts` + `app/robots.ts`; legacy 301s in `next.config.ts`
  `redirects()`.
- **AI authoring (optional):** `actions/ai/*` (generate-draft, rewrite, translate, suggest-seo,
  generate-cover-image, research) over the Vercel AI SDK with a provider registry
  (`lib/ai/providers.ts`) + availability check (`lib/ai/availability.ts`, `app/api/ai/availability`).
  Gated to admins. Skip for v1 of SOSvyzivne unless wanted.

---

## 9. Environment variables (from aqunama `.env.example`)

```bash
# Email (Resend)
RESEND_API_KEY= ; RESEND_FROM_EMAIL= ; RESEND_TO_EMAIL=
# Contact anti-spam (Turnstile)
NEXT_PUBLIC_TURNSTILE_SITE_KEY= ; TURNSTILE_SECRET_KEY=
# Analytics (PostHog) — empty disables
NEXT_PUBLIC_POSTHOG_KEY= ; NEXT_PUBLIC_POSTHOG_HOST=
# Database (Prisma / PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db
# Auth (better-auth)
BETTER_AUTH_SECRET= ; BETTER_AUTH_URL= ; NEXT_PUBLIC_APP_URL=
ADMIN_EMAILS=admin@example.com           # bootstrap first admin
# Media
UPLOADTHING_TOKEN=
# AI providers (optional)
GOOGLE_GENERATIVE_AI_API_KEY= ; OPENAI_API_KEY= ; PERPLEXITY_API_KEY= ; TOGETHER_API_KEY= ; XAI_API_KEY=
# Public site URL (metadataBase, sitemap)
NEXT_PUBLIC_SITE_URL=
# Footer socials (omit to hide)
LINKEDIN_URL= ; X_URL= ; FACEBOOK_URL=
```

---

## 10. How to adapt this to SOSvyzivne.cz

**Reuse verbatim:** the whole `lib/auth/*`, `lib/db.ts`, `(admin)`/`(auth)` route groups, admin chrome
(`components/admin/*`), CMS editor (`components/cms/*`), `actions/cms/*`, user/RBAC/audit system,
UploadThing media, Resend email, SEO helper, consent + PostHog, Turnstile contact form, i18n wiring.

**Change for SOSvyzivne:**

1. **Locales:** `routing.ts` → `locales: ["cs"]`, `defaultLocale: "cs"`. One catalog `messages/cs.json`.
2. **Content types:** trim/rename the `ContentType` enum to what SOSvyzivne needs:
   `BLOG_POST`, `FAQ`, `PAGE` (drop `CASE_STUDY`, `INDUSTRY`, `NEWS`; or keep `NEWS` for the
   "Novinky z blogu"). Add a per-type `data` schema only where a page needs structured fields
   (most SOSvyzivne articles are just title + body, so `data` can stay null).
3. **Public routes:** replace aqunama's service/industry pages with SOSvyzivne's IA from
   `01-site-overview.md`:
   ```
   app/[locale]/
     page.tsx                                  # home (O nás)
     chci-pomoc-s-vymahanim-vyzivneho/page.tsx # lead form (Resend + Turnstile)
     kalkulacka/page.tsx                       # calculator (client island, see 05)
     faq/page.tsx + [slug]/page.tsx            # FAQ hub + answer (Content type=FAQ)
     blog/page.tsx + [slug]/page.tsx           # blog (Content type=BLOG_POST/NEWS)
     kontakt/page.tsx                          # donations + contact
     (admin)/… (auth)/…                        # reuse as-is
   ```
4. **Public content reads:** the blog/FAQ list + detail pages read from `Content` via `lib/cms/*`
   (replacing aqunama's news/case-study readers). Article body rendered from TipTap HTML/JSON.
5. **Lead form:** aqunama's contact action is the template for "Chci pomoc" — swap fields to
   Jméno/Email/Telefon/PSČ/Zpráva + GDPR consent, keep Turnstile + Resend (`RESEND_TO_EMAIL=
   info@sosvyzivne.cz`).
6. **Branding:** apply SOSvyzivne tokens from `02-design-system.md` (Playfair Display + Open Sans,
   pink/peach/terracotta) to `globals.css` / Tailwind theme instead of aqunama's fonts.
7. **Migration:** import the ~50 legacy articles/FAQ answers (content from `03`) into `Content` rows
   via a one-off script modeled on aqunama's `scripts/migrate/*` (which seed `Content` from data
   files). Preserve slugs 1:1 (`06`).
8. **Redirects:** put the `06` redirect map in `next.config.ts` `redirects()` (same mechanism aqunama
   uses for its legacy 301s).

**Result:** SOSvyzivne gets the same architecture — a Czech public marketing site (home, lead form,
calculator, FAQ, blog, donations) plus a passwordless admin where staff manage blog/FAQ content,
media, and admin users, with audit logging — by reskinning aqunama and swapping the content model +
routes.

---

## 11. CMS content model for Blog & FAQ (build-ready)

**Decision (2026-06-13): the CMS is the system of record for Blog and FAQ.** Staff create/edit/publish
both in the admin; the public site reads from the DB. No MDX for these. Use the generic `Content`
table — keep the model, narrow the enum.

### Prisma enum (SOSvyzivne)
```prisma
enum ContentType   { BLOG_POST  FAQ  PAGE }     // dropped CASE_STUDY, INDUSTRY, NEWS
enum ContentStatus { DRAFT  PUBLISHED  ARCHIVED } // unchanged
```
Keep the rest of `Content` exactly as aqunama has it (`@@unique([type, locale, slug])`, indexes,
`translationKey`, `data Json?`, `authorId`, `tags`). `locale` is always `"cs"` for now but stays in
the key so an `en` rollout is non-breaking.

### Field usage per type

| Field | BLOG_POST | FAQ |
|-------|-----------|-----|
| `title` | post headline | **the question** (e.g. "Je poskytování vašich služeb zdarma?") |
| `slug` | post slug (preserve legacy, `06`) | answer-page slug (preserve legacy `-2` suffixes via redirect-canonicalization) |
| `body` (TipTap HTML) | full article | **the answer** |
| `excerpt` | teaser for `/blog` cards + home "Novinky" | optional short answer / used in accordion preview |
| `coverImage` | article hero / card thumb | usually empty |
| `metaTitle`/`metaDescription`/`ogImage` | per-article SEO | per-answer SEO |
| `publishedAt` | drives blog ordering (newest first) | ordering within category |
| `tags` | topic tags (Exekuce, Náhradní výživné, …) | reused as **FAQ category** |
| `data` (Json, validated) | usually `null` | `{ "order": number, "category"?: string }` for manual sort/grouping |
| `status` | DRAFT → PUBLISHED → ARCHIVED | same |

`data` is validated per type via a zod schema in `lib/cms/schemas.ts` (mirror aqunama's
`contentInputDiscriminated` `superRefine`):
```ts
// FAQ structured payload (optional)
export const faqData = z.object({
  order: z.number().int().min(0).default(0),
  category: z.string().max(120).optional(),
}).strict();
// BLOG_POST: data stays null (no structured fields needed) — or add { readingMinutes } later.
```

### Admin workflow (reuses `components/cms/*` + `actions/cms/content.ts` unchanged)
- `/content` list (TanStack table) filterable by `type` (Blog vs FAQ) and `status`.
- `/content/new` and `/content/[id]/edit` use `content-form` + `tiptap-editor` for the body, the
  image-picker for `coverImage`, tag input for category/topic, SEO fields, and a Draft/Publish toggle.
- Server actions already authorize (`requireAdmin`), zod-validate, and `revalidatePath` the affected
  public paths — extend `publicPathFor()` so FAQ/blog revalidate correctly:
  ```ts
  function publicPathFor(type, slug) {
    switch (type) {
      case "BLOG_POST": return `/blog/${slug}`;
      case "FAQ":       return `/faq/${slug}`;   // if answers are deep-linkable pages
      default:          return null;             // PAGE handled case-by-case
    }
  }
  // also revalidate the hubs: revalidatePath("/blog"), revalidatePath("/faq"), and "/" (home teasers)
  ```

### Public read layer (`lib/cms/*`)
Add small data-access modules (modeled on aqunama's `lib/cms/news.ts` / `case-studies.ts`):
```ts
// lib/cms/blog.ts
getPublishedPosts({ locale, page, perPage })   // order by publishedAt desc, status=PUBLISHED
getPostBySlug(locale, slug)
getLatestPosts(locale, 3)                       // home "Novinky z blogu"
// lib/cms/faq.ts
getFaqs(locale)                                 // status=PUBLISHED, order by data.order then title; group by category
getFaqBySlug(locale, slug)
```
- `/blog` and `/blog/[slug]` → render from `getPublishedPosts` / `getPostBySlug`; `Article`/
  `BlogPosting` JSON-LD; paginate (replaces legacy `/blog/2..4`).
- `/faq` → render `getFaqs` as an accessible accordion **and** keep deep-linkable `/faq/[slug]`
  answer pages (SEO); emit **`FAQPage` JSON-LD** from the same data.
- TipTap output is sanitized HTML; render via a `Prose` component with the `02` typography tokens.

### Pages caching
Public blog/FAQ pages are statically rendered and refreshed on publish via `revalidatePath` in the
content action (ISR-on-demand) — no rebuild needed when staff publish. `generateStaticParams` for
`[slug]` from published rows.

### Migration (one-off script, `scripts/migrate/`)
Map the crawled content from `03-content-inventory.md` into `Content` rows:
- 20+ FAQ questions → `FAQ` rows (`title`=question, `body`=answer, `slug`=legacy slug, `data.order`,
  `tags`=category).
- ~30 blog/legal explainers → `BLOG_POST` rows (`title`, `body`, `excerpt`, `publishedAt`, `slug`).
- Resolve the duplicate-topic pairs flagged in `06` (canonical row + 301 the dupes).
- Set an author (seeded admin) as `authorId`. Preserve all slugs 1:1; run alongside the `06` redirect
  map for the corrupt/encoded slug and `-2` duplicates.

This keeps **everything in aqunama's CMS reusable** — only the enum, two `lib/cms/*` reader modules,
the `publicPathFor` map, and the public `/blog` + `/faq` routes are SOSvyzivne-specific.
