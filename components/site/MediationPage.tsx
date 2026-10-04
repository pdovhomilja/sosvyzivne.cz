import { MEDIATION as M } from "@/lib/content/mediation";
import { ORG } from "@/lib/org";
import { IMG } from "@/lib/site/images";
import { ContactForm } from "@/app/[locale]/chci-pomoc-s-vymahanim-vyzivneho/ContactForm";
import { Accent } from "./Accent";
import { Container } from "./Container";
import { PageHead } from "./PageHead";
import { PhotoFrame } from "./PhotoFrame";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 mt-12 text-[31px] font-semibold tracking-[-.03em] text-plum md:text-[40px] lg:mt-16 [&_.font-accent]:text-rose">
    {children}
  </h2>
);

const MEDIATORS = [
  { name: "PhDr. Lenka Ranšová, DiS.", image: IMG.mediaceLenka },
  { name: "JUDr. PhDr. Luděk Žákovec, Ph.D.", image: IMG.mediaceLudek },
];

export function MediationPage() {
  return (
    <>
      <PageHead
        crumbs={[{ href: "/jak-pomahame", label: "Jak pomáháme" }]}
        title={
          <>
            Rodinná <Accent>mediace</Accent>
          </>
        }
        lead={M.lead}
      />
      <Container className="max-w-[900px] pt-10 text-lg text-wine lg:pt-[72px]">
        <div className="grid gap-5">
          {M.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <H2>
          Naši <Accent>mediátoři</Accent>
        </H2>
        <div className="grid max-w-[560px] grid-cols-2 gap-6">
          {MEDIATORS.map((m, i) => (
            <figure key={m.name} className="m-0 grid gap-3">
              <PhotoFrame
                src={m.image.src}
                alt={m.image.alt}
                width={m.image.width}
                height={m.image.height}
                sizes="260px"
                rotate={i ? 1.5 : -1.5}
                className="aspect-[4/5] w-full overflow-hidden p-1.5"
                imgClassName="object-[50%_20%]"
              />
              <figcaption>
                <b className="block text-[15px] leading-tight text-plum">{m.name}</b>
                <small className="text-[13px] text-wine-muted">akreditovaný mediátor</small>
              </figcaption>
            </figure>
          ))}
        </div>

        <H2>
          Rodinná <Accent>mediace</Accent>
        </H2>
        <div className="grid gap-5">
          {M.family.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <H2>
          S čím vám může <Accent>pomoci</Accent>
        </H2>
        <ul className="m-0 grid list-none gap-2.5 p-0 md:grid-cols-2">
          {M.topics.map((t) => (
            <li key={t} className="rounded-[14px] bg-white px-[18px] py-3.5 text-base">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base text-wine-muted">
          Mediace nemusí řešit jen jeden problém. Často pomůže otevřít a vyřešit postupně více oblastí sporu.
        </p>

        <H2>
          Proč může být <Accent>přínosná</Accent>
        </H2>
        <div className="grid gap-5">
          {M.benefits.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <H2>
          Jak mediace <Accent>probíhá</Accent>
        </H2>
        <ol className="m-0 grid list-none gap-3 p-0">
          {M.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[52px_minmax(0,1fr)] items-start gap-3.5 rounded-[18px] bg-sand px-5 py-[18px]">
              <span className="font-accent text-[44px] italic leading-[.9] text-rose" aria-hidden>
                {i + 1}
              </span>
              <div>
                <b className="block text-lg text-plum">{s.title}</b>
                <span className="text-[15px] text-wine-muted">{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6">{M.mediatorRole}</p>

        <H2>
          Mediace a <Accent>výživné</Accent>
        </H2>
        <div className="grid gap-5">
          {M.alimony.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <H2>
          Mediace vs. <Accent>soud</Accent>
        </H2>
        <div className="overflow-x-auto rounded-3xl bg-white">
          <table className="w-full border-collapse text-left text-base">
            <thead>
              <tr className="text-plum">
                <th className="px-5 py-4">Mediace</th>
                <th className="px-5 py-4">Soudní řízení</th>
              </tr>
            </thead>
            <tbody>
              {M.comparison.map(([a, b]) => (
                <tr key={a} className="border-t border-[#EFE3D6]">
                  <td className="px-5 py-3">{a}</td>
                  <td className="px-5 py-3 text-wine-muted">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <H2>
          Časté <Accent>otázky</Accent>
        </H2>
        <div>
          {M.faq.map((f) => (
            <details key={f.q} className="group border-b-[1.5px] border-[#E6D6C6] py-[18px]">
              <summary className="flex cursor-pointer list-none justify-between gap-4 font-semibold text-plum [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-[22px] leading-none text-rose group-open:hidden" aria-hidden>
                  +
                </span>
                <span className="hidden text-[22px] leading-none text-rose group-open:inline" aria-hidden>
                  –
                </span>
              </summary>
              <p className="mt-2.5 text-base text-wine-muted">{f.a}</p>
            </details>
          ))}
        </div>

        <H2>
          Ceník <Accent>služeb</Accent>
        </H2>
        <div className="grid gap-4 md:grid-cols-3">
          {M.prices.map((p) => (
            <div key={p.title} className="rounded-3xl bg-white p-6">
              <b className="block text-plum">{p.title}</b>
              <span className="mt-1 block font-accent text-3xl italic text-rose">{p.price}</span>
              <p className="mt-2 text-[15px] text-wine-muted">{p.text}</p>
            </div>
          ))}
        </div>
        <ul className="mt-5 grid gap-1.5 pl-5 text-base text-wine-muted">
          {M.priceNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>

        <H2>
          Máte o mediaci <Accent>zájem?</Accent>
        </H2>
        <p className="mb-6">
          Zanechte nám na sebe kontakt a ozveme se vám. Můžete také napsat přímo na{" "}
          <a href={`mailto:${ORG.mediationEmail}`} className="font-semibold text-rose underline underline-offset-4">
            {ORG.mediationEmail}
          </a>
          .
        </p>
        <section className="rounded-3xl bg-white p-6 md:p-10">
          <ContactForm topic="mediace" />
        </section>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
