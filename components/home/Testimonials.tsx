import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";

const TESTIMONIALS = [
  {
    quote:
      "Díky SOS výživné se mi konečně podařilo získat dlužné alimenty za dva roky. Celý proces byl neuvěřitelně hladký a lidský.",
    name: "Alena",
    role: "Maminka na mateřské",
    initial: "A",
  },
  {
    quote:
      "Profesionální přístup a jasná komunikace. Pomohli mi v momentě, kdy jsem už ztrácel naději na férové vyrovnání.",
    name: "František",
    role: "Otec samoživitel",
    initial: "F",
  },
  {
    quote:
      "Nejdřív jsem se bála poplatků, ale opravdu je vše zdarma. Doporučuji každému, kdo bojuje s neplatiči.",
    name: "Jana",
    role: "Zaměstnaná maminka",
    initial: "J",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <Container>
        <h2 className="font-heading text-4xl text-ink text-center mb-16">
          Spokojení klienti
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="p-8 rounded-2xl border border-hairline bg-surface-subtle"
            >
              {/* 5 stars */}
              <div className="flex text-primary mb-4" aria-label="5 hvězdiček z 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="italic text-ink mb-8 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-4">
                {/* Avatar circle with initial */}
                <div
                  className="w-12 h-12 rounded-full bg-peach flex items-center justify-center font-bold text-terracotta shrink-0"
                  aria-hidden="true"
                >
                  {t.initial}
                </div>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-ink-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
