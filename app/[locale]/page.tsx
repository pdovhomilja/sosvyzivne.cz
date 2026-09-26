import { setRequestLocale } from "next-intl/server";
import { getLatestPosts } from "@/lib/cms/blog";
import { getEndorsements } from "@/lib/cms/endorsements";
import { ORG } from "@/lib/org";
import { IMG, type ImageKey } from "@/lib/site/images";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Container } from "@/components/site/Container";
import { NoteChip } from "@/components/site/NoteChip";
import { Highlight } from "@/components/site/Highlight";
import { Accent } from "@/components/site/Accent";
import { Button } from "@/components/site/Button";
import { PhotoFrame } from "@/components/site/PhotoFrame";
import { OrgBar } from "@/components/site/OrgBar";
import { SectionHead } from "@/components/site/SectionHead";
import { TopicCard } from "@/components/site/TopicCard";
import { StepCards } from "@/components/site/StepCards";
import { StatTile } from "@/components/site/StatTile";
import { TeamGrid } from "@/components/site/TeamGrid";
import { GuideCard } from "@/components/site/GuideCard";
import { PostCard } from "@/components/site/PostCard";
import { Endorsements } from "@/components/site/Endorsements";

// Revalidate hourly: the ad-landing page must be fast (PageSpeed mobile).
// DB-failure fallbacks below still render the page without CMS sections.
export const revalidate = 3600;

const HERO_FRAMES: { key: ImageKey; cls: string; rotate: number }[] = [
  { key: "heroMomDaughter", cls: "lg:left-[4%] lg:top-[120px] lg:h-[250px] lg:w-[210px]", rotate: -3 },
  { key: "heroMomSonKitchen", cls: "lg:right-[5%] lg:top-[70px] lg:h-[210px] lg:w-[190px]", rotate: 2.5 },
  { key: "heroWindow", cls: "lg:bottom-[190px] lg:left-[14%] lg:h-[180px] lg:w-[170px]", rotate: 2 },
  { key: "heroPaperwork", cls: "max-lg:hidden lg:bottom-[200px] lg:right-[12%] lg:h-[160px] lg:w-[200px]", rotate: -2 },
];
const POST_FALLBACK: ImageKey[] = ["blogWalk", "blogStreet", "heroPaperwork"];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  let latest: Awaited<ReturnType<typeof getLatestPosts>> = [];
  try {
    latest = await getLatestPosts(locale, 3);
  } catch (err) {
    console.error("[home] failed to load latest posts:", err);
  }

  let endorsements: Awaited<ReturnType<typeof getEndorsements>> = [];
  try {
    endorsements = await getEndorsements(locale);
  } catch (err) {
    console.error("[home] failed to load endorsements:", err);
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#AEBBCC_0%,#D9CBC0_26%,#F2D3B0_46%,#E5A27F_68%,#B45658_86%,#6E2F40_100%)]">
        <SiteHeader tone="sky" />
        <Container className="relative flex flex-col items-center pb-[200px] pt-6 text-center lg:min-h-[760px] lg:justify-center lg:pb-[170px] lg:pt-10">
          <NoteChip>Nezisková organizace · pomoc je zdarma</NoteChip>
          <h1 className="relative z-10 mt-6 max-w-[13ch] text-[44px] font-semibold leading-[1.02] tracking-[-.03em] text-balance text-plum sm:text-6xl lg:text-[86px]">
            Výživné, na které má vaše dítě <Highlight>nárok.</Highlight>
          </h1>
          <p className="relative z-10 mt-2.5 font-accent text-[32px] italic leading-tight text-[#7A2E3C] lg:text-5xl">
            Pomůžeme vám ho získat.
          </p>
          <p className="relative z-10 mt-5 max-w-[52ch] text-[17px] text-[#3E2230] lg:text-[19px]">
            Rodičům samoživitelům, rozvedeným a studentům pomáháme zdarma vymáhat neplacené výživné, od první
            konzultace až po jednání s exekutorem.
          </p>
          <div className="relative z-10 mt-7 flex w-full flex-wrap justify-center gap-3 max-sm:flex-col">
            <Button href="/chci-pomoc-s-vymahanim-vyzivneho">Chci pomoc s výživným</Button>
            <Button href={`tel:${ORG.phone}`} variant="glass">
              Zavolat {ORG.phoneDisplay}
            </Button>
          </div>
          <div className="mt-8 flex w-full gap-2.5 px-1.5 lg:contents">
            {HERO_FRAMES.map((f, i) => {
              const img = IMG[f.key];
              return (
                <PhotoFrame
                  key={f.key}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(max-width: 1024px) 33vw, 210px"
                  priority={i === 0}
                  rotate={f.rotate}
                  className={`h-[140px] min-w-0 flex-1 p-[5px] lg:absolute lg:flex-none lg:p-2 ${f.cls}`}
                />
              );
            })}
          </div>
        </Container>
        <OrgBar />
      </section>

      <Container>
        <section className="pt-[72px] lg:pt-28">
          <SectionHead
            label="Komu pomáháme"
            title={<>Nejste v tom <Accent>sami.</Accent></>}
            intro="Ať je vaše situace jakákoli, začneme tím, že vás vyslechneme. Pak vám řekneme, co jde udělat."
          />
          <div className="grid gap-5 md:grid-cols-3">
            <TopicCard
              href="/jak-pomahame/vymahani-vyzivneho"
              title="Rodič samoživitel"
              text="Pečujete o dítě a druhý rodič neplatí stanovené výživné včas nebo vůbec."
              image="topicMomHug"
            />
            <TopicCard
              href="/jak-pomahame/vymahani-vyzivneho"
              title="Rozvedený rodič"
              text="Máte pravomocný rozsudek o výživném, ale druhá strana ho nerespektuje."
              image="topicPaperwork"
            />
            <TopicCard
              href="/jak-pomahame/zletili-studenti"
              title="Zletilý student"
              text="Studujete a rodič přestal plnit vyživovací povinnost vůči vám."
              image="topicStudent"
            />
          </div>
        </section>

        <section className="pt-[72px] lg:pt-28">
          <SectionHead label="Jak to funguje" title={<>Dvě věci uděláte vy. Zbytek <Accent>zařídíme my.</Accent></>} />
          <StepCards />
          <p className="mt-5 text-center text-wine-muted">
            Konzultace i telefonát jsou zdarma. Odpovídáme zpravidla do 24 hodin.
          </p>
        </section>
      </Container>

      <section className="mt-[72px] bg-plum py-[72px] text-[#F6E6DA] lg:mt-28 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-[13px] font-bold uppercase tracking-[.14em] text-honey">Kdo jsme</span>
            <h2 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-.03em] text-[#FFF6EC] lg:text-[56px]">
              Malý tým z Kralovic. Na straně rodičů <span className="text-honey"><Accent>od roku {ORG.since}.</Accent></span>
            </h2>
            <blockquote className="mt-7 font-accent text-[27px] leading-[1.2] text-[#FFF6EC] lg:text-[34px]">
              „Kromě právní a administrativní pomoci klademe důraz na lidský přístup a pochopení v náročném období.“
            </blockquote>
            <cite className="mt-4 block text-[15px] not-italic text-[#D9BFB3]">
              PhDr. Lenka Ranšová, DiS., ředitelka SOS výživné
            </cite>
            <div className="mt-9 grid grid-cols-2 gap-4">
              <StatTile value="200+" label="nových klientů v roce 2024" />
              <StatTile value="200+" label="nových klientů v roce 2025" />
              <StatTile value={String(ORG.fundSince)} label="od tohoto roku jsme nadační fond" />
              <StatTile value="Plzeň-jih" label="spolupráce s Exekutorským úřadem" />
            </div>
            <p className="mt-4 text-[13px] text-[#BFA296]">
              Zdroj:{" "}
              <Link href="/vyrocni-zpravy" className="text-[#BFA296] underline">
                výroční zprávy 2024 a 2025
              </Link>{" "}
              ·{" "}
              <Link href="/o-nas" className="text-[#BFA296] underline">
                O nás a náš tým
              </Link>
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[300px] lg:max-w-[400px]">
            <PhotoFrame
              src={IMG.lenka.src}
              alt={IMG.lenka.alt}
              width={IMG.lenka.width}
              height={IMG.lenka.height}
              sizes="400px"
              rotate={-2}
              className="aspect-[4/5] overflow-hidden"
              imgClassName="object-[50%_20%]"
              caption="PhDr. Lenka Ranšová, ředitelka"
            />
            <div className="absolute -right-1 top-9 max-w-[200px] rotate-3 rounded-2xl bg-honey px-4 py-3.5 text-sm text-plum lg:-right-[18px]">
              <b className="block font-accent text-2xl font-normal italic leading-none">Zavolejte nám.</b>
              Stačí pět minut a budete vědět, co dál.
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section className="pt-[72px] lg:pt-28">
          <SectionHead
            label="Náš tým"
            title={<>Lidé, kteří vám <Accent>pomohou</Accent></>}
            intro="Poradenství, administrativa a právní zastoupení. Tým fondu, dobrovolníci a spolupracující advokáti."
          />
          <TeamGrid />
        </section>

        <section className="pt-[72px] lg:pt-28">
          <GuideCard />
        </section>

        {latest.length > 0 && (
          <section className="pt-[72px] lg:pt-28">
            <SectionHead
              label="Z poradny"
              title={<>Co se mění a <Accent>co můžete udělat</Accent></>}
              action={
                <Button href="/blog" variant="glass">
                  Všechny články
                </Button>
              }
            />
            <div className="grid gap-5 md:grid-cols-3">
              {latest.map((p, i) => {
                const fb = IMG[POST_FALLBACK[i % POST_FALLBACK.length]];
                return (
                  <PostCard
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    title={p.title}
                    image={p.coverImage ? { src: p.coverImage, alt: "" } : { src: fb.src, alt: "" }}
                  />
                );
              })}
            </div>
          </section>
        )}

        {endorsements.length > 0 && (
          <section className="pt-[72px] lg:pt-28">
            <SectionHead label="Zkušenosti klientů" title={<>Co říkají <Accent>rodiče</Accent></>} />
            <Endorsements items={endorsements} />
          </section>
        )}

        <section className="pt-[72px] lg:pt-28">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-sand px-5 py-7 md:flex-row md:items-center md:px-12 md:py-10">
            <h2 className="text-[30px] font-semibold leading-tight tracking-[-.03em] text-plum md:text-[38px]">
              Pomáháme zdarma díky <span className="text-rose"><Accent>dárcům.</Accent></span>
            </h2>
            <div>
              <small className="block text-[13px] text-wine-muted">Transparentní účet</small>
              <span className="text-[21px] font-semibold tracking-[-.02em] text-plum tabular-nums md:text-[26px]">
                {ORG.donationAccount}
              </span>
            </div>
            <Button href="/podporte-nas">Podpořte nás</Button>
          </div>
        </section>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
