import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ORG } from "@/lib/org";
import { REPORTS } from "@/lib/content/annual-reports";
import { donationQrSvg } from "@/lib/payment-qr";
import { CopyAccountButton } from "@/components/contact/CopyAccountButton";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";

export const metadata: Metadata = {
  title: "Podpořte nás – SOS výživné nadační fond",
  description: `Pomáháme rodičům a dětem zdarma díky dárcům. Transparentní účet ${ORG.donationAccount}, QR platba.`,
};

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const qr = await donationQrSvg(ORG.donationAccount, "Dar SOS vyzivne");
  const supporters = REPORTS[0].donationsReceived.filter((d) => d.donor !== "soukromý dárce");
  return (
    <>
      <PageHead
        title={
          <>
            Pomáháme zdarma díky <Accent>dárcům</Accent>
          </>
        }
        lead="Naše práce má smysl díky lidem, kterým není lhostejný osud rodičů samoživitelů a jejich dětí. Pomoci může opravdu každý – sdílením našich aktivit, doporučením dál nebo finanční podporou."
      />
      <Container className="grid items-start gap-5 pt-10 lg:grid-cols-[1.2fr_.8fr] lg:pt-[72px]">
        <section className="rounded-3xl bg-white p-7 md:p-10">
          <h2 className="text-[28px] font-semibold tracking-[-.02em] text-plum">Transparentní účet</h2>
          <p className="mt-3 text-[26px] font-semibold tracking-[-.02em] text-plum tabular-nums md:text-[32px]">
            {ORG.donationAccount}
          </p>
          <p className="mt-1 text-wine-muted">{ORG.legalName} · IČO {ORG.ico}</p>
          <div className="mt-5">
            <CopyAccountButton account={ORG.donationAccount} />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div
              className="h-[180px] w-[180px] rounded-2xl bg-white p-2 ring-1 ring-[#EFE3D6] [&_svg]:h-full [&_svg]:w-full"
              aria-label="QR kód pro platbu daru"
              role="img"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="max-w-[28ch] text-wine-muted">
              Naskenujte QR kód bankovní aplikací. Variabilní symbol není povinný, do zprávy můžete uvést své jméno nebo účel daru.
            </p>
          </div>
          <div className="mt-8 grid gap-4 text-wine">
            <p>
              Z darů financujeme nejen právní a psychologické poradenství, ale také obědy ve škole a školní pomůcky pro
              děti z rodin, kde jeden z rodičů výživné neplatí. Každý příspěvek – jakkoli malý – přímo mění životy těchto
              rodin.
            </p>
            <p>
              Rádi vám vystavíme potvrzení o daru, které můžete uplatnit pro daňové účely. V případě firemní podpory
              připravujeme darovací smlouvy podle individuální domluvy.
            </p>
          </div>
        </section>
        <aside className="rounded-3xl bg-sand p-7">
          <h2 className="text-[24px] font-semibold tracking-[-.02em] text-plum">Kdo nás podporuje</h2>
          <ul className="mt-4 grid gap-3">
            {supporters.map((d) => (
              <li key={d.donor} className="text-wine">
                <b className="block text-plum">{d.donor}</b>
                <span className="text-wine-muted">{[d.amount, d.note].filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-wine-muted">Údaje z výroční zprávy {REPORTS[0].year}.</p>
          <div className="mt-4">
            <Button href="/vyrocni-zpravy" variant="glass">
              Výroční zprávy
            </Button>
          </div>
        </aside>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
