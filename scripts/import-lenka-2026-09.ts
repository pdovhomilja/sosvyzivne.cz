/**
 * Content from Lenka Ranšová's e-mail of 30. 9. 2026.
 *
 *   pnpm tsx scripts/import-lenka-2026-09.ts
 *
 * 1. Publishes the three real client stories as ENDORSEMENTs (clients gave consent;
 *    full stories are PDFs in public/dokumenty/pribeh-*.pdf).
 * 2. Archives the three placeholder endorsements from seed-content.ts (alena, frantisek, jana).
 * 3. Corrects the blog post on náhradní výživné: who is entitled, and 72 months instead of 24
 *    (MPSV: from 1. 7. 2025).
 *
 * Idempotent: endorsements upsert by (type, locale, slug); the blog fix only replaces text
 * that is still there. Visible on the site after revalidation (≤ 1 h) or an admin save.
 */
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const LOCALE = "cs";

const STORIES = [
  {
    slug: "pribeh-hana",
    name: "Hana Novotná",
    role: "maminka, náhradní výživné pro syna",
    quote: "Dnes mám jistotu, že výživné pro syna pravidelně dostanu.",
    order: 1,
  },
  {
    slug: "pribeh-jana",
    name: "Jana",
    role: "maminka tří dcer",
    quote: "Člověk někdy nepotřebuje jen právní radu. Potřebuje také vědět, že na to není sám.",
    order: 2,
  },
  {
    slug: "pribeh-katerina",
    name: "Kateřina",
    role: "maminka pěti dětí",
    quote: "Nechtěla jsem nic víc než to, aby otec svých dětí plnil to, co mu ukládá soud.",
    order: 3,
  },
];

const PLACEHOLDERS = ["alena", "frantisek", "jana"];

const BLOG_SLUG = "nahradni-vyzivne-pomoc-proti-neplaticum";

const BLOG_FIXES: [string, string][] = [
  [
    `<p>Nárok na náhradní výživné má nezaopatřené dítě, které má trvalý pobyt v&nbsp;České republice. To jsou primárně děti až do skončení povinné školní docházky.</p>
<p>Dále to může být dítě do 18 let, které je po skončení povinné školní docházky vedeno na úřadu práce jako uchazeč o zaměstnání bez nároku na podporu v&nbsp;nezaměstnanosti.</p>
<p>Také to může být osoba do 26 let, která stále studuje nebo nemůže studovat anebo pracovat ze zdravotních důvodů.</p>`,
    `<p>Nárok na náhradní výživné může mít nezaopatřené dítě s&nbsp;trvalým pobytem v&nbsp;České republice, pokud rodič svou vyživovací povinnost řádně neplní a výživné je vymáháno v&nbsp;exekučním řízení.</p>
<p>Za nezaopatřené dítě se považuje především dítě až do skončení povinné školní docházky. Nárok může pokračovat i po jejím skončení, pokud se dítě soustavně připravuje na budoucí povolání, typicky studiem.</p>
<p>U dítěte, které již povinnou školní docházku ukončilo, je proto důležité, zda ve studiu skutečně pokračuje. Pokud dítě studium ukončí a dále se na budoucí povolání nepřipravuje, zpravidla zaniká jeho nárok na výživné do budoucna. V&nbsp;takovém případě se také řeší ukončení vymáhání výživného od data, kdy nárok zanikl.</p>
<p>Nárok může za určitých podmínek trvat až do 26 let věku, pokud dítě nadále splňuje podmínky nezaopatřenosti – například se soustavně připravuje na budoucí povolání, případně se nemůže připravovat na povolání nebo pracovat z&nbsp;důvodu zdravotního stavu.</p>
<p>Pokud si nejste jistí, zda máte na výživné nebo náhradní výživné nárok, můžeme vaši situaci posoudit a s&nbsp;případným vymáháním vám pomoci.</p>`,
  ],
  [
    `<p>Nárok na náhradní výživné trvá 24 měsíců. Po uplynutí této doby je možné o náhradní výživné znovu zažádat. Pokud se státem určené výživné v&nbsp;průběhu této doby (24 měsíců) změní, tato změna se projeví i v&nbsp;náhradním výživném, a to následující měsíc po rozhodnutí o změně výše výživného.</p>`,
    `<p>Náhradní výživné je možné čerpat celkem až 72 měsíců. Tato doba nemusí být vyčerpána nepřetržitě. Když například druhý rodič začne výživné řádně hradit, může být výplata náhradního výživného ukončena nebo přerušena. Pokud by následně s&nbsp;placením opět přestal a budou znovu splněny zákonné podmínky, je možné v&nbsp;čerpání náhradního výživného pokračovat.</p>
<p>Pokud se v&nbsp;průběhu čerpání změní soudem stanovená výše výživného, promítne se tato změna také do výše náhradního výživného, a to podle pravidel stanovených pro jeho výplatu.</p>`,
  ],
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

  const admin = await db.user.findFirst({ where: { isAdmin: true } });
  if (!admin) throw new Error("No admin found — run `pnpm seed:admins` first.");

  for (const s of STORIES) {
    const fields = {
      status: "PUBLISHED" as const,
      title: s.name,
      body: s.quote,
      data: { order: s.order, role: s.role, rating: 5, consent: true },
    };
    await db.content.upsert({
      where: { type_locale_slug: { type: "ENDORSEMENT", locale: LOCALE, slug: s.slug } },
      update: fields,
      create: { ...fields, type: "ENDORSEMENT", locale: LOCALE, slug: s.slug, publishedAt: new Date(), authorId: admin.id },
    });
    console.log(`endorsement ${s.slug}: published`);
  }

  const archived = await db.content.updateMany({
    where: { type: "ENDORSEMENT", locale: LOCALE, slug: { in: PLACEHOLDERS }, status: { not: "ARCHIVED" } },
    data: { status: "ARCHIVED" },
  });
  console.log(`placeholder endorsements archived: ${archived.count}`);

  const post = await db.content.findUnique({
    where: { type_locale_slug: { type: "BLOG_POST", locale: LOCALE, slug: BLOG_SLUG } },
  });
  if (!post) throw new Error(`Blog post ${BLOG_SLUG} not found`);
  let body = post.body;
  for (const [from, to] of BLOG_FIXES) {
    if (body.includes(from)) body = body.replace(from, to);
    else if (!body.includes(to)) throw new Error(`Blog post ${BLOG_SLUG}: expected text not found, fix it in the admin`);
  }
  if (body !== post.body) {
    await db.content.update({ where: { id: post.id }, data: { body } });
    console.log(`blog ${BLOG_SLUG}: corrected`);
  } else {
    console.log(`blog ${BLOG_SLUG}: already up to date`);
  }

  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
