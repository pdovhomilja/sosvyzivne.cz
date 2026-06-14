import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { EndorsementItem } from "@/lib/cms/endorsements";

export function Testimonials({ items }: { items: EndorsementItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <Container>
        <h2 className="font-heading text-4xl text-ink text-center mb-16">
          Spokojení klienti
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t) => {
            const rating = Math.min(5, Math.max(1, t.rating));
            const subtitle = [t.role, t.location].filter(Boolean).join(" · ");
            return (
              <div
                key={t.id}
                className="p-8 rounded-2xl border border-hairline bg-surface-subtle"
              >
                <div
                  className="flex text-primary mb-4"
                  aria-label={`${rating} hvězdiček z 5`}
                >
                  {Array.from({ length: rating }).map((_, i) => (
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
                  {t.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.photo}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full bg-peach flex items-center justify-center font-bold text-terracotta shrink-0"
                      aria-hidden="true"
                    >
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold">{t.name}</p>
                    {subtitle && (
                      <p className="text-xs text-ink-muted">{subtitle}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
