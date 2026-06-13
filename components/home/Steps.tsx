import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const STEPS = [
  {
    title: "Rozsudek o výživném",
    text: "Budeme od vás potřebovat kopii rozsudku, který stanovuje výši alimentů.",
  },
  {
    title: "Podepíšete plnou moc",
    text: "Zmocníte nás k tomu, abychom vás mohli zastupovat v jednání s úřady.",
  },
  {
    title: "Vše ostatní zařídíme my",
    text: "Naši odborníci převezmou veškerou administrativu a komunikaci.",
  },
];

export function Steps() {
  return (
    <section className="py-24 bg-peach-light">
      <Container>
        <div id="jak" className="scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl text-ink mb-4">Jak postupovat?</h2>
            <p className="text-ink-muted max-w-xl mx-auto">
              Tři jednoduché kroky k zajištění budoucnosti vašich dětí.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Decorative dashed connector line (desktop) */}
            <div
              className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-terracotta/30 z-0"
              aria-hidden="true"
            />

            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
                  <span className="text-2xl font-bold text-primary">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-ink-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/chci-pomoc-s-vymahanim-vyzivneho">Chci pomoc</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
