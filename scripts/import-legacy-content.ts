/**
 * Legacy content migration — pulls all posts from the old WordPress site's REST
 * API and recreates them in the Content table, preserving slugs 1:1 for SEO.
 *
 *   pnpm import:legacy
 *
 * Requires DATABASE_URL and at least one admin user (run `pnpm seed:admins`
 * first — the migrated content is attributed to that admin).
 *
 * Idempotent: upserts by (type, locale, slug), so re-running refreshes content
 * in place. Posts are classified BLOG_POST vs FAQ via lib/legacy-redirects.ts
 * (the same source of truth that drives the 301 redirect map).
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  LEGACY_FAQ_SLUGS,
  CONSOLIDATED_DUPLICATES,
  canonicalSlug,
} from "../lib/legacy-redirects";

const WP_API = "https://www.sosvyzivne.cz/wp-json/wp/v2/posts";
const LOCALE = "cs";

const FAQ_SLUGS = LEGACY_FAQ_SLUGS as readonly string[];
const FAQ_ORDER = new Map(FAQ_SLUGS.map((slug, i) => [slug, i + 1]));

type WpPost = {
  slug: string;
  title: { rendered: string };
  date: string;
  excerpt: { rendered: string };
  content: { rendered: string };
};

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(
      `${WP_API}?per_page=50&page=${page}&_fields=slug,title,date,excerpt,content`,
    );
    if (res.status === 400) break; // WP returns 400 once page > totalPages
    if (!res.ok) throw new Error(`WP API ${res.status} on page ${page}`);
    const batch = (await res.json()) as WpPost[];
    posts.push(...batch);
    if (batch.length < 50) break;
  }
  return posts;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#39;": "'",
  "&#8217;": "’",
  "&#8211;": "–",
  "&#8230;": "…",
  "&hellip;": "…",
  "&nbsp;": " ",
};

function decodeEntities(s: string): string {
  return s.replace(/&[#a-z0-9]+;/gi, (m) => ENTITIES[m] ?? m);
}

/**
 * Clean WordPress/Gutenberg HTML into the simple subset TipTap/prose renders:
 * paragraphs, headings, lists, tables, links, emphasis, rules. Drops the
 * decorative stock-photo thumbnails (the new design supplies its own imagery)
 * and strips presentational attributes (classes, data-*, inline sizing).
 */
function cleanBody(raw: string): string {
  let html = raw;

  // Drop images and any attachment <a> that only wrapped an image.
  html = html.replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, "");
  html = html.replace(/<img[^>]*>/gi, "");

  // Normalise legacy emphasis tags.
  html = html.replace(/<\/?b\b[^>]*>/gi, (m) => (m[1] === "/" ? "</strong>" : "<strong>"));
  html = html.replace(/<\/?i\b[^>]*>/gi, (m) => (m[1] === "/" ? "</em>" : "<em>"));

  // Whitelist tags + strip attributes (keep href on links, span on table cells).
  html = html.replace(/<([a-z0-9]+)((?:\s[^<>]*)?)>/gi, (_m, tag: string, attrs: string) => {
    const t = tag.toLowerCase();
    if (t === "a") {
      const href = attrs.match(/\shref="([^"]*)"/i)?.[1];
      return href ? `<a href="${href}">` : "<a>";
    }
    if (t === "td" || t === "th") {
      const colspan = attrs.match(/\scolspan="([^"]*)"/i)?.[1];
      const rowspan = attrs.match(/\srowspan="([^"]*)"/i)?.[1];
      let extra = "";
      if (colspan) extra += ` colspan="${colspan}"`;
      if (rowspan) extra += ` rowspan="${rowspan}"`;
      return `<${t}${extra}>`;
    }
    return `<${t}>`;
  });

  // Unwrap Gutenberg <figure> shells now that their <img> is gone.
  html = html.replace(/<\/?figure>/gi, "");

  // Collapse whitespace and drop empty paragraphs left behind.
  html = html
    .replace(/<p>\s*(?:&nbsp;)?\s*<\/p>/gi, "")
    .replace(/[ \t]*\n[ \t]*\n+/g, "\n")
    .replace(/>\s+</g, ">\n<")
    .trim();

  return html;
}

/** WordPress excerpts are HTML with a trailing "[…]" — reduce to plain text. */
function cleanExcerpt(raw: string): string {
  const text = decodeEntities(raw.replace(/<[^>]+>/g, " "))
    .replace(/\[(?:…|\.\.\.|&hellip;)\]\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || undefined!;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const admin = await db.user.findFirst({ where: { isAdmin: true } });
  if (!admin) throw new Error("No admin found — run `pnpm seed:admins` first.");

  console.log("Fetching posts from WordPress REST API…");
  const posts = await fetchAllPosts();
  console.log(`Fetched ${posts.length} posts.\n`);

  let blog = 0;
  let faq = 0;

  for (const post of posts) {
    const slug = canonicalSlug(post.slug);
    const isFaq = FAQ_SLUGS.includes(post.slug);
    const type = isFaq ? "FAQ" : "BLOG_POST";
    const title = decodeEntities(post.title.rendered).trim();
    const body = cleanBody(post.content.rendered);
    const excerpt = cleanExcerpt(post.excerpt.rendered);
    const publishedAt = new Date(post.date);
    const data = isFaq ? { order: FAQ_ORDER.get(post.slug) ?? 999 } : undefined;

    const base = {
      status: "PUBLISHED" as const,
      title,
      body,
      excerpt: isFaq ? null : (excerpt ?? null),
      data,
      publishedAt,
      authorId: admin.id,
    };

    await db.content.upsert({
      where: { type_locale_slug: { type, locale: LOCALE, slug } },
      update: base,
      create: { type, locale: LOCALE, slug, ...base },
    });

    if (isFaq) faq++;
    else blog++;
    console.log(`✓ ${type.padEnd(9)} ${slug}`);
  }

  console.log(`\nImported ${blog} blog posts + ${faq} FAQ = ${blog + faq}.`);

  // Retire same-topic duplicates: archive the loser so it drops off the public
  // site (the 301 in lib/legacy-redirects.ts sends its URLs to the canonical).
  for (const dup of CONSOLIDATED_DUPLICATES) {
    const type = dup.fromType === "faq" ? "FAQ" : "BLOG_POST";
    const { count } = await db.content.updateMany({
      where: { type, locale: LOCALE, slug: dup.fromSlug },
      data: { status: "ARCHIVED" },
    });
    console.log(
      `↩ archived ${type} ${dup.fromSlug} (${count}) → ${dup.to}`,
    );
  }

  console.log("\nDone.");
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
