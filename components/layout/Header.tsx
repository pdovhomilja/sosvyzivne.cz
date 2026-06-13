import { getTranslations } from "next-intl/server";
import { Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ORG } from "@/lib/org";

export async function Header() {
  const t = await getTranslations("nav");
  return (
    <header className="border-b border-border">
      {/* Utility top bar */}
      <div className="bg-accent text-white">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href={`mailto:${ORG.email}`} className="flex items-center gap-1 text-white">
              <Mail size={14} /> {ORG.email}
            </a>
            <a href={`tel:${ORG.phone}`} className="flex items-center gap-1 text-white">
              <Phone size={14} /> {ORG.phoneDisplay}
            </a>
          </div>
          <a href={ORG.facebook} className="text-white" aria-label="Facebook">
            Facebook
          </a>
        </Container>
      </div>

      {/* Main nav */}
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="font-heading text-xl font-bold text-accent">
          {ORG.shortName}
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-ink hover:text-accent">{t("about")}</Link>
          <Link href="/faq" className="text-ink hover:text-accent">{t("faq")}</Link>
          <Link href="/blog" className="text-ink hover:text-accent">{t("blog")}</Link>
          <Link href="/kontakt" className="text-ink hover:text-accent">{t("support")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/kalkulacka">{t("calculator")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/chci-pomoc-s-vymahanim-vyzivneho">{t("getHelp")}</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
