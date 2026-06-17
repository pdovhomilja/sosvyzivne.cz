import { getTranslations } from "next-intl/server";
import { Phone, Mail, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ORG } from "@/lib/org";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Header() {
  const t = await getTranslations("nav");

  const items = [
    { href: "/", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/blog", label: t("blog") },
    { href: "/kontakt", label: t("support") },
  ];

  const navLinkClass = "text-ink transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm";

  return (
    <>
      {/* Utility bar */}
      <div className="bg-terracotta text-white">
        <Container className="flex h-10 items-center justify-between text-xs font-body">
          {/* Desktop: contact details */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href={`mailto:${ORG.email}`}
              className="flex items-center gap-1 text-white hover:underline"
            >
              <Mail size={14} aria-hidden />
              {ORG.email}
            </a>
            <a
              href={`tel:${ORG.phone}`}
              className="flex items-center gap-1 text-white hover:underline"
            >
              <Phone size={14} aria-hidden />
              {ORG.phoneDisplay}
            </a>
            <span className="flex items-center gap-1">Pracovní doba</span>
          </div>
          {/* Mobile fallback */}
          <div className="md:hidden">Pomáháme samoživitelům</div>
          {/* Facebook – always visible */}
          <a
            href={ORG.facebook}
            className="text-white hover:underline"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </Container>
      </div>

      {/* Main nav – sticky */}
      <header className="sticky top-0 z-30 bg-surface border-b border-hairline">
        <Container className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="font-heading text-2xl font-bold text-ink">
            {ORG.shortName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 text-base md:flex" aria-label="Hlavní navigace">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navLinkClass}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search – links to the search page */}
            <Link
              href="/hledat"
              aria-label="Hledat"
              className="hidden items-center justify-center rounded-md p-2 text-ink-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:inline-flex"
            >
              <Search size={18} aria-hidden />
            </Link>

            {/* Kalkulačka – outline, desktop only */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/kalkulacka">{t("calculator")}</Link>
            </Button>

            {/* Chci pomoc – pink pill, always visible */}
            <Button asChild size="sm">
              <Link href="/chci-pomoc-s-vymahanim-vyzivneho">{t("getHelp")}</Link>
            </Button>

            {/* Mobile hamburger – rendered by MobileNav (md:hidden internally) */}
            <MobileNav
              items={items}
              calculatorLabel={t("calculator")}
              getHelpLabel={t("getHelp")}
            />
          </div>
        </Container>
      </header>
    </>
  );
}
