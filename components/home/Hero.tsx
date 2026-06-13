import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";

export function Hero() {
  const imgs = pageImages("home");
  const heroImg = imgs[0];

  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imgSrc(heroImg)}
          alt={altText(heroImg)}
          fill
          className="object-cover"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h1 className="font-heading text-5xl md:text-6xl text-ink leading-tight mb-6">
            Nečekejte! Získejte výživné, na které mají vaše děti nárok.
          </h1>
          <p className="text-xl text-ink-muted mb-8 leading-relaxed">
            Pomáháme vám zajistit budoucnost vašich dětí s klidem a jistotou. Bezplatně, lidsky a s profesionální péčí.
          </p>
          <Button asChild size="lg">
            <Link href="#jak">Jak začít?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
