import { Link } from "@/i18n/navigation";
import type { Service } from "@/lib/content/services";
import { ORG } from "@/lib/org";
import { HELP_CTA } from "@/lib/site/nav";
import { Accent } from "./Accent";
import { Button } from "./Button";
import { Container } from "./Container";
import { PageHead } from "./PageHead";
import { Verify } from "./Verify";

function lastWordAccent(title: string) {
  const i = title.lastIndexOf(" ");
  if (i < 0) return <Accent>{title}</Accent>;
  return (
    <>
      {title.slice(0, i)} <Accent>{title.slice(i + 1)}</Accent>
    </>
  );
}

function Tick() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8454D" strokeWidth="3" aria-hidden className="mt-1 shrink-0">
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

const H2 = ({ children, first }: { children: React.ReactNode; first?: boolean }) => (
  <h2 className={`${first ? "" : "mt-10 lg:mt-14"} mb-4 text-[31px] font-semibold tracking-[-.03em] text-plum md:text-[40px] [&_.font-accent]:text-rose`}>
    {children}
  </h2>
);

export function SideCta() {
  return (
    <aside className="flex flex-col gap-3.5 rounded-3xl bg-white p-7 shadow-[0_20px_50px_-30px_rgba(59,28,41,.35)] lg:sticky lg:top-6">
      <h3 className="text-[30px] font-semibold tracking-[-.02em] text-plum">
        Začneme <span className="text-rose"><Accent>vaším</Accent></span> případem?
      </h3>
      <p className="text-[15px] text-wine-muted">Napište nám nebo zavolejte. Odpovídáme zpravidla do 24 hodin.</p>
      <Button href={HELP_CTA.href} className="w-full">
        Chci pomoc s výživným
      </Button>
      <Button href={`tel:${ORG.phone}`} variant="glass" className="w-full">
        {ORG.phoneDisplay}
      </Button>
      <p className="border-t border-[#EFE3D6] pt-3.5 text-[13px] text-wine-muted">
        {ORG.legalName} · IČO {ORG.ico} · pomoc je zdarma
      </p>
    </aside>
  );
}

export function ServiceArticle({ service: s }: { service: Service }) {
  return (
    <>
      <PageHead
        crumbs={[{ href: "/jak-pomahame", label: "Jak pomáháme" }]}
        title={lastWordAccent(s.title)}
        lead={
          <>
            <p>{s.lead}</p>
            {s.verify.length > 0 && <Verify label={`ověřit s Lenkou: ${s.verify.join(", ")}`} />}
          </>
        }
        image={s.image}
      />
      <Container className="grid items-start gap-10 pt-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14 lg:pt-[72px]">
        <div>
          <H2 first>
            Kdy vám můžeme <Accent>pomoci</Accent>
          </H2>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {s.when.map((t) => (
              <li key={t} className="flex gap-3 rounded-[14px] bg-white px-[18px] py-3.5 text-wine">
                <Tick />
                {t}
              </li>
            ))}
          </ul>
          <H2>
            Co od vás <Accent>potřebujeme</Accent>
          </H2>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {s.need.map((t) => (
              <li key={t} className="flex gap-3 rounded-[14px] bg-white px-[18px] py-3.5 text-wine">
                <Tick />
                {t}
              </li>
            ))}
          </ul>
          <H2>
            Jak postup <Accent>probíhá</Accent>
          </H2>
          <ol className="m-0 grid list-none gap-3 p-0">
            {s.flow.map((f, i) => (
              <li key={f.title} className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-3.5 rounded-[18px] bg-sand px-5 py-[18px]">
                <span className="font-accent text-[44px] italic leading-[.9] text-rose" aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <b className="block text-lg text-plum">{f.title}</b>
                  <span className="text-[15px] text-wine-muted">{f.text}</span>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-3xl bg-plum p-7 text-[#F6E6DA]">
            <b className="block text-[26px] tracking-[-.02em] text-[#FFF6EC]">{s.price.title}</b>
            <p className="mt-2">{s.price.text}</p>
          </div>
          <H2>
            Časté <Accent>otázky</Accent>
          </H2>
          <div>
            {s.faq.map((f) => (
              <details key={f.q} className="group border-b-[1.5px] border-[#E6D6C6] py-[18px]">
                <summary className="flex cursor-pointer list-none justify-between gap-4 text-lg font-semibold text-plum [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-[22px] leading-none text-rose group-open:hidden" aria-hidden>
                    +
                  </span>
                  <span className="hidden text-[22px] leading-none text-rose group-open:inline" aria-hidden>
                    –
                  </span>
                </summary>
                <p className="mt-2.5 text-wine-muted">{f.a}</p>
              </details>
            ))}
          </div>
          {s.related && (
            <p className="mt-8">
              Více:{" "}
              <Link href={s.related.href} className="font-semibold text-rose underline underline-offset-4">
                {s.related.label}
              </Link>
            </p>
          )}
        </div>
        <SideCta />
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
