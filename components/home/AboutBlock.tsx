import Image from "next/image";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";
import { Container } from "@/components/ui/container";

export function AboutBlock() {
  const imgs = pageImages("home");
  // About block uses the second image (index 1) — team/office photo
  const aboutImg = imgs[1];

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text column */}
          <div>
            <h2 className="font-heading text-4xl text-ink mb-6">O nás</h2>
            <div className="space-y-4 text-ink-muted leading-relaxed">
              <p>
                V <strong className="text-ink">SOS výživné nadačním fondu</strong> věříme,
                že žádné dítě by nemělo doplácet na to, že dospělí nenesou svou
                odpovědnost. A žádný rodič by neměl zůstávat na řešení složité
                životní situace sám.
              </p>
              <p>
                Jsme nezisková organizace, která pomáhá rodinám s dětmi,
                samoživitelům a studentům domoci se výživného. Naše služby jsou
                pro vás zcela zdarma — náklady hradíme z darů a grantů.
              </p>
              <p>
                Věříme v transparentnost a férovost. Proto každoročně zveřejňujeme
                výroční zprávy, abyste věděli, jak nakládáme se svěřenými
                prostředky.
              </p>
            </div>

            {/* Annual report buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/dokumenty/vyrocni-zprava-2023.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta rounded-[var(--radius-pill)] px-6 h-11 font-semibold hover:bg-terracotta hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Výroční zpráva 2023
              </a>
              <a
                href="/dokumenty/vyrocni-zprava-2024.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta rounded-[var(--radius-pill)] px-6 h-11 font-semibold hover:bg-terracotta hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Výroční zpráva 2024
              </a>
              <a
                href="/dokumenty/vyrocni-zprava-2025.pdf"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center border-2 border-terracotta text-terracotta rounded-[var(--radius-pill)] px-6 h-11 font-semibold hover:bg-terracotta hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Výroční zpráva 2025
              </a>
            </div>
          </div>

          {/* Image column */}
          <div className="relative">
            <div className="absolute -inset-4 bg-peach-light rounded-xl -rotate-2" aria-hidden="true" />
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl w-full h-[400px]">
              <Image
                src={imgSrc(aboutImg)}
                alt={altText(aboutImg)}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
