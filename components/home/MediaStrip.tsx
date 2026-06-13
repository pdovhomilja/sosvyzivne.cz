import { Container } from "@/components/ui/container";

export function MediaStrip() {
  return (
    <section className="py-12 bg-surface-subtle border-y border-hairline">
      <Container>
        <h2 className="text-center text-ink-muted text-sm mb-8 uppercase tracking-widest">
          Kde jste o nás mohli slyšet?
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-bold font-heading" aria-label="iDNES">
            iDNES
          </span>
          <span
            className="text-2xl font-bold border-2 border-ink px-2"
            aria-label="Česká televize"
          >
            ČT
          </span>
          <span className="text-2xl font-bold tracking-tighter" aria-label="iRozhlas">
            iRozhlas
          </span>
          <span
            className="text-2xl font-extrabold italic text-ink-muted"
            aria-label="TV Nova"
          >
            TV NOVA
          </span>
          <span className="text-xl font-bold text-ink-muted" aria-label="CNN Prima">
            CNN PRIMA
          </span>
        </div>
      </Container>
    </section>
  );
}
