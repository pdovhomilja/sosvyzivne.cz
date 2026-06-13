import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export async function CtaBand() {
  const t = await getTranslations("cta");
  return (
    <section className="bg-secondary-tint py-12">
      <Container className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-2xl sm:text-3xl">{t("title")}</h2>
        <p className="text-ink-muted">{t("tagline")}</p>
        <Button asChild size="lg">
          <Link href="/chci-pomoc-s-vymahanim-vyzivneho">{t("title")}</Link>
        </Button>
      </Container>
    </section>
  );
}
