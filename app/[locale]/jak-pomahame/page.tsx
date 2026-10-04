import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { SERVICES } from "@/lib/content/services";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { TopicCard } from "@/components/site/TopicCard";
import { SectionHead } from "@/components/site/SectionHead";
import { StepCards } from "@/components/site/StepCards";
import { Button } from "@/components/site/Button";
import { HELP_CTA } from "@/lib/site/nav";

export const metadata: Metadata = {
  title: "Jak pomáháme – SOS výživné",
  description:
    "Vymáhání neplaceného výživného, náhradní výživné, zvýšení výživného, výživné pro zletilé studenty a mediace. Pomoc je zdarma.",
};

export default async function HowWeHelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHead
        title={
          <>
            Pomoc, která je <Accent>zdarma</Accent>
          </>
        }
        lead="Rodičům samoživitelům, rozvedeným a zletilým studentům pomáháme získat výživné, na které mají nárok. Vyberte, co nejlépe odpovídá vaší situaci."
      />
      <Container className="pt-10 lg:pt-[72px]">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <TopicCard key={s.slug} href={`/jak-pomahame/${s.slug}`} title={s.title} text={s.card} image={s.image} />
          ))}
        </div>
        <section className="pt-[72px] lg:pt-28">
          <SectionHead label="Jak to funguje" title={<>Dvě věci uděláte vy. Zbytek <Accent>zařídíme my.</Accent></>} />
          <StepCards />
          <div className="mt-8 flex justify-center">
            <Button href={HELP_CTA.href}>Chci pomoc s výživným</Button>
          </div>
        </section>
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
