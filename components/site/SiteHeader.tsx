import { Link } from "@/i18n/navigation";
import { NAV, HELP_CTA } from "@/lib/site/nav";
import { ORG } from "@/lib/org";
import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * tone="sky": transparent, sits inside the homepage gradient hero.
 * tone="cream": solid, top of every other page.
 * The mobile menu is a <details> element so it works without JavaScript.
 */
export function SiteHeader({ tone = "cream" }: { tone?: "sky" | "cream" }) {
  return (
    <header className={tone === "cream" ? "bg-cream" : "relative z-20"}>
      <Container className="flex items-center justify-between gap-5 py-5 lg:py-6">
        <Logo />
        <nav
          aria-label="Hlavní menu"
          className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/50 p-1.5 backdrop-blur lg:flex"
        >
          {NAV.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] font-medium text-plum hover:bg-white/70"
            >
              {i.label}
            </Link>
          ))}
          <Link
            href={HELP_CTA.href}
            className="whitespace-nowrap rounded-full bg-plum px-4 py-2 text-[15px] font-medium text-[#FFF6EC] hover:bg-[#27111B]"
          >
            {HELP_CTA.label}
          </Link>
        </nav>
        <details data-mobile-menu className="relative lg:hidden">
          <summary
            aria-label="Menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-plum text-[#FFF6EC] [&::-webkit-details-marker]:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="absolute right-0 top-14 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-1 rounded-3xl bg-cream p-4 shadow-xl">
            {NAV.map((i) => (
              <Link key={i.href} href={i.href} className="rounded-xl px-3 py-2.5 text-lg font-medium text-plum hover:bg-sand">
                {i.label}
              </Link>
            ))}
            <Link href={HELP_CTA.href} className="mt-2 rounded-full bg-plum px-4 py-3 text-center font-semibold text-[#FFF6EC]">
              {HELP_CTA.label}
            </Link>
            <a href={`tel:${ORG.phone}`} className="px-3 py-2 text-center font-semibold text-plum">
              {ORG.phoneDisplay}
            </a>
          </div>
        </details>
      </Container>
    </header>
  );
}
