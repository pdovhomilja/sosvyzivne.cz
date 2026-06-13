import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getLatestPosts } from "@/lib/cms/blog";

export const dynamic = "force-dynamic";

const AUDIENCE = [
  {
    title: "Jsem rodič samoživitel",
    text: "Jste rodič samoživitel/ka a Váš bývalý partner či partnerka neplatí výživné? Pak se naše služba týká právě Vás…",
  },
  {
    title: "Jsem rozvedená/ý",
    text: "Kromě vyživovací povinnosti na dítě existuje také vyživovací povinnost, kterou mohou vůči sobě mít i bývalí manželé…",
  },
  {
    title: "Jsem plnoletý student",
    text: "Pokud jste dosáhl/a plnoletosti a stále studujete, tedy se připravujete na budoucí povolání, máte právo na výživné…",
  },
];

const STEPS = [
  "Pošlete nám ofocený nebo naskenovaný rozsudek.",
  "Podepište nám plnou moc, abychom Vás mohli zastupovat.",
  "Vše ostatní zařídíme my.",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let latest: Awaited<ReturnType<typeof getLatestPosts>> = [];
  try {
    latest = await getLatestPosts(locale, 3);
  } catch {
    // DB not connected yet — render without blog teasers.
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary-tint">
        <Container className="flex flex-col items-center gap-6 py-20 text-center">
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Nečekejte! Získejte výživné, na které mají vaše děti nárok.
          </h1>
          <Button asChild size="lg">
            <Link href="#jak">Jak začít?</Link>
          </Button>
        </Container>
      </section>

      {/* O nás */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl">O nás</h2>
          <div className="prose-cms mt-4">
            <p>
              V <strong>SOS výživné nadačním fondu</strong> věříme, že žádné dítě
              by nemělo doplácet na to, že dospělí nenesou svou odpovědnost. A
              žádný rodič by neměl zůstávat na řešení složité životní situace sám.
            </p>
            <p>
              Jsme nezisková organizace, která pomáhá rodinám s dětmi,
              samoživitelům a studentům domoci výživného, na které mají podle
              zákona nárok. Nabízíme kompletní podporu – od prvních informací a
              administrativy až po právní poradenství a zastoupení. A to vše{" "}
              <strong>zcela zdarma</strong>.
            </p>
          </div>
        </div>
      </Section>

      {/* Mám nárok na vaši službu? */}
      <Section muted>
        <h2 className="text-center text-3xl">Mám nárok na vaši službu?</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((a) => (
            <div
              key={a.title}
              className="rounded-[var(--radius-md)] border border-border bg-surface p-6"
            >
              <h3 className="text-xl">{a.title}</h3>
              <p className="mt-2 text-ink-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Jak postupovat? */}
      <Section>
        <div id="jak" className="scroll-mt-24">
          <h2 className="text-center text-3xl">Jak postupovat?</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={i}
                className="rounded-[var(--radius-md)] bg-surface-muted p-6 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-4 text-ink">{s}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href="/chci-pomoc-s-vymahanim-vyzivneho">Chci pomoc</Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Novinky z blogu */}
      {latest.length > 0 && (
        <Section muted>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl">Novinky z blogu</h2>
            <Link href="/blog" className="text-accent hover:underline">
              Zobrazit vše
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {latest.map((p) => (
              <article
                key={p.id}
                className="rounded-[var(--radius-md)] border border-border bg-surface p-6"
              >
                <h3 className="text-lg">
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-ink-muted">
                    {p.excerpt}
                  </p>
                )}
                <Link
                  href={`/blog/${p.slug}`}
                  className="mt-3 inline-block text-sm text-accent hover:underline"
                >
                  Celý článek »
                </Link>
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
