import { Link } from "@/i18n/navigation";
import { IMG, type ImageKey } from "@/lib/site/images";
import { SiteHeader } from "./SiteHeader";
import { Container } from "./Container";
import { PhotoFrame } from "./PhotoFrame";

/** Header + light sunset band used at the top of every inner page. */
export function PageHead({
  crumbs = [],
  title,
  lead,
  image,
  children,
}: {
  crumbs?: { href: string; label: string }[];
  title: React.ReactNode;
  lead?: React.ReactNode;
  image?: ImageKey;
  children?: React.ReactNode;
}) {
  const img = image ? IMG[image] : undefined;
  return (
    <div className="bg-[linear-gradient(180deg,#AEBBCC_0%,#E7D2C0_40%,#F2D3B0_70%,#EBB795_100%)]">
      <SiteHeader tone="sky" />
      <Container className={`grid items-end gap-7 pb-10 pt-4 lg:gap-10 lg:pb-16 lg:pt-6 ${img ? "lg:grid-cols-[1.4fr_.6fr]" : ""}`}>
        <div>
          {crumbs.length > 0 && (
            <nav aria-label="Drobečková navigace" className="mb-4 text-sm text-plum-2">
              <Link href="/" className="text-plum-2 underline underline-offset-4">
                Domů
              </Link>
              {crumbs.map((c) => (
                <span key={c.href}>
                  {" / "}
                  <Link href={c.href} className="text-plum-2 underline underline-offset-4">
                    {c.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-[40px] font-semibold leading-[1.02] tracking-[-.03em] text-balance text-plum md:text-6xl lg:text-[72px] [&_.font-accent]:text-rose">
            {title}
          </h1>
          {lead ? <div className="mt-4 max-w-[54ch] text-[17px] text-[#3E2230] md:text-[19px]">{lead}</div> : null}
          {children}
        </div>
        {img ? (
          <PhotoFrame
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(max-width: 1024px) 220px, 320px"
            priority
            rotate={2}
            className="aspect-square w-full max-w-[220px] overflow-hidden lg:max-w-none"
          />
        ) : null}
      </Container>
    </div>
  );
}
