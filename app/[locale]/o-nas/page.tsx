import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ABOUT, DOWNLOADS } from "@/lib/content/about";
import { ORG } from "@/lib/org";
import { IMG } from "@/lib/site/images";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { PhotoFrame } from "@/components/site/PhotoFrame";
import { SectionHead } from "@/components/site/SectionHead";
import { TeamGrid } from "@/components/site/TeamGrid";
import { Button } from "@/components/site/Button";

export const metadata: Metadata = {
  title: "O nás – SOS výživné nadační fond",
  description:
    "SOS výživné nadační fond (IČO 17850983) pomáhá od roku 2019 rodičům samoživitelům a studentům získat výživné. Poslání, správní rada, tým a partneři.",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHead
        title={
          <>
            Na straně rodičů <Accent>od roku {ORG.since}</Accent>
          </>
        }
        lead={`${ORG.legalName}, IČO ${ORG.ico}. Nezisková organizace, která zdarma pomáhá rodičům a studentům získat výživné, na které mají nárok.`}
      />
      <Container className="pt-10 lg:pt-[72px]">
        <section className="grid items-center gap-12 lg:grid-cols-[1.3fr_.7fr]">
          <div className="grid gap-5 text-lg text-wine">
            {ABOUT.story.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <blockquote className="mt-2 border-l-4 border-rose pl-5 font-accent text-[27px] italic leading-tight text-plum">
              „Kromě právní a administrativní pomoci klademe důraz na lidský přístup a pochopení v náročném období.“
              <cite className="mt-2 block font-sans text-[15px] not-italic text-wine-muted">
                PhDr. Lenka Ranšová, DiS., ředitelka
              </cite>
            </blockquote>
          </div>
          <div className="mx-auto w-full max-w-[320px]">
            <PhotoFrame
              src={IMG.lenka.src}
              alt={IMG.lenka.alt}
              width={IMG.lenka.width}
              height={IMG.lenka.height}
              sizes="320px"
              rotate={2}
              className="aspect-[4/5] overflow-hidden"
              imgClassName="object-[50%_20%]"
            />
          </div>
        </section>

        <section className="pt-[72px] lg:pt-28">
          <SectionHead label="Z nadační listiny" title={<>Naše <Accent>poslání</Accent></>} />
          <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
            {ORG.purpose.map((p, i) => (
              <li key={i} className="rounded-3xl bg-white p-7 text-wine">
                <span className="font-accent text-5xl italic leading-none text-rose" aria-hidden>
                  {i + 1}
                </span>
                <p className="mt-3">{p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pt-[72px] lg:pt-28">
          <SectionHead
            label="Náš tým"
            title={<>Lidé, kteří vám <Accent>pomohou</Accent></>}
            intro="Tým fondu, dobrovolníci a spolupracující advokáti."
          />
          <TeamGrid />
        </section>

        <section className="grid gap-5 pt-[72px] md:grid-cols-2 lg:pt-28">
          <div className="rounded-3xl bg-sand p-7">
            <h2 className="text-[28px] font-semibold tracking-[-.02em] text-plum">Správní rada</h2>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-wine">
              <dt className="text-wine-muted">Předseda</dt>
              <dd className="m-0">{ORG.board.chair}</dd>
              <dt className="text-wine-muted">Členky</dt>
              <dd className="m-0">{ORG.board.members.join(", ")}</dd>
              <dt className="text-wine-muted">Revizorka</dt>
              <dd className="m-0">{ORG.board.auditor}</dd>
              <dt className="text-wine-muted">Sídlo</dt>
              <dd className="m-0">{ORG.seat}</dd>
              <dt className="text-wine-muted">Kancelář</dt>
              <dd className="m-0">{ORG.office}</dd>
            </dl>
          </div>
          <div className="rounded-3xl bg-sand p-7">
            <h2 className="text-[28px] font-semibold tracking-[-.02em] text-plum">Partneři a podporovatelé</h2>
            <ul className="mt-4 grid list-none gap-3 p-0">
              {ABOUT.partners.map((p) => (
                <li key={p.name} className="text-wine">
                  <b className="block text-plum">{p.name}</b>
                  <span className="text-wine-muted">{p.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pt-[72px] lg:pt-28">
          <SectionHead label="Materiály" title={<>Ke <Accent>stažení</Accent></>} />
          <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
            {DOWNLOADS.map((d) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  download
                  className="flex items-center justify-between gap-4 rounded-[18px] bg-white px-5 py-4 font-semibold text-plum hover:bg-sand"
                >
                  {d.label}
                  <span className="text-[13px] font-bold uppercase tracking-wide text-rose">{d.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/vyrocni-zpravy">Výroční zprávy</Button>
          <Button href="/podporte-nas" variant="glass">
            Podpořte nás
          </Button>
        </div>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
