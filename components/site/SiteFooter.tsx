import { Link } from "@/i18n/navigation";
import { FOOTER_HELP, FOOTER_FUND } from "@/lib/site/nav";
import { ORG } from "@/lib/org";
import { Accent } from "./Accent";
import { Button } from "./Button";
import { Container } from "./Container";
import { SocialIcons } from "@/components/SocialIcons";
import { getSocialSettings } from "@/lib/social";

export async function SiteFooter() {
  const socials = await getSocialSettings();
  return (
    <footer className="bg-[linear-gradient(180deg,#6E2F40_0%,#3B1C29_40%)] text-[#E9DCD3] [&_ul_a]:text-[#E9DCD3]">
      <Container className="grid gap-10 py-16 text-[15px] md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-5">
          <p className="text-3xl font-semibold leading-tight tracking-[-.02em] text-[#FFF6EC]">
            Nevíte, jestli vám můžeme pomoci? <span className="text-honey"><Accent>Zavolejte.</Accent></span>
          </p>
          <Button href={`tel:${ORG.phone}`} variant="cream">
            {ORG.phoneDisplay}
          </Button>
          <SocialIcons variant="footer" links={socials} />
        </div>
        <div>
          <b className="mb-3 block text-[#FFF6EC]">{ORG.legalName}</b>
          IČO {ORG.ico}
          <br />
          Datová schránka {ORG.dataBox}
          <br />
          Sídlo {ORG.seat}
          <br />
          Kancelář {ORG.office}
        </div>
        <div>
          <b className="mb-3 block text-[#FFF6EC]">Pomoc</b>
          <ul className="grid gap-1.5">
            {FOOTER_HELP.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <b className="mb-3 block text-[#FFF6EC]">Nadační fond</b>
          <ul className="grid gap-1.5">
            {FOOTER_FUND.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-white hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={`mailto:${ORG.email}`} className="hover:text-white hover:underline">
                {ORG.email}
              </a>
            </li>
            <li>{ORG.hours.map((h) => `${h.day} ${h.time}`).join(" · ")}</li>
            <li>Účet {ORG.donationAccount}</li>
          </ul>
        </div>
        <p className="border-t border-white/15 pt-5 text-[13px] text-[#BFA296] md:col-span-2 lg:col-span-4">
          © {new Date().getFullYear()} {ORG.legalName} · nezisková organizace · pomoc je zdarma
        </p>
      </Container>
    </footer>
  );
}
