import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export async function CtaBand() {
  const t = await getTranslations("cta");
  return (
    <section className="py-20 bg-peach-light">
      <Container className="flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl text-ink mb-4">{t("title")}</h2>
        <p className="text-xl text-ink-muted mb-10">{t("tagline")}</p>
        <Button asChild size="lg" className="mx-auto px-12 shadow-xl shadow-primary/30">
          <Link href="/chci-pomoc-s-vymahanim-vyzivneho">{t("title")}</Link>
        </Button>
      </Container>
    </section>
  );
}
