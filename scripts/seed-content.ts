/**
 * Demo content seed (a few FAQ + blog rows) so the public site and admin show
 * real data in development. Run after seed:admins:
 *   pnpm seed:content
 * For the full legacy migration, expand this from docs/03 + docs/06.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const FAQS = [
  {
    slug: "je-poskytovani-vasich-sluzeb-zdarma",
    title: "Je poskytování vašich služeb zdarma?",
    body: "<p>Ano, naše služby, včetně právního zastoupení, jsou <strong>zcela zdarma</strong> pro naše klienty. Jsme nezisková organizace. V případě úspěšné exekuce si náklady vymáháme od dlužníka. Při neúspěšné exekuci náklady hradíme my. Vždy vám vymáháme <strong>celou dlužnou částku bez krácení</strong>.</p>",
    order: 1,
  },
  {
    slug: "mohu-vymahat-vyzivne-i-zpetne",
    title: "Mohu vymáhat výživné i zpětně?",
    body: "<p>Pokud rozsudek již máte, lze vymáhat zpětně až 10 let. Pokud rozsudek zatím nemáte, lze vymáhat pouze 3 roky zpětně.</p>",
    order: 2,
  },
];

const POSTS = [
  {
    slug: "nahradni-vyzivne-pomoc-proti-neplaticum",
    title: "Náhradní výživné – pomoc proti neplatičům",
    excerpt:
      "Od 1. července 2021 je možné zažádat o náhradní výživné – sociální dávku, kterou stát vyplácí, když výživné není placeno.",
    body: "<p>Od 1. července 2021 je možné zažádat o náhradní výživné – tedy sociální dávku, kterou stát vyplácí v případě, že je výživné placeno zčásti nebo není placeno vůbec.</p><h2>Kdo má nárok?</h2><p>Nárok má nezaopatřené dítě s trvalým pobytem v ČR.</p>",
  },
];

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

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const admin = await db.user.findFirst({ where: { isAdmin: true } });
  if (!admin) throw new Error("No admin found — run `pnpm seed:admins` first.");

  for (const f of FAQS) {
    await db.content.upsert({
      where: { type_locale_slug: { type: "FAQ", locale: "cs", slug: f.slug } },
      update: {},
      create: {
        type: "FAQ",
        status: "PUBLISHED",
        locale: "cs",
        slug: f.slug,
        title: f.title,
        body: f.body,
        data: { order: f.order },
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
    console.log(`✓ FAQ: ${f.slug}`);
  }

  for (const p of POSTS) {
    await db.content.upsert({
      where: {
        type_locale_slug: { type: "BLOG_POST", locale: "cs", slug: p.slug },
      },
      update: {},
      create: {
        type: "BLOG_POST",
        status: "PUBLISHED",
        locale: "cs",
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
    console.log(`✓ post: ${p.slug}`);
  }

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

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
