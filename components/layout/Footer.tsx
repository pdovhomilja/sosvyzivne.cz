import { Container } from "@/components/ui/container";
import { ORG } from "@/lib/org";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-bold text-accent">{ORG.legalName}</p>
          <p className="mt-2 text-sm text-ink-muted">{ORG.tagline}</p>
        </div>
        <div className="text-sm">
          <h3 className="mb-2 text-base">Kontakt</h3>
          <p>
            <a href={`mailto:${ORG.email}`}>{ORG.email}</a>
          </p>
          <p>
            <a href={`tel:${ORG.phone}`}>{ORG.phoneDisplay}</a>
          </p>
          <p className="mt-2 font-semibold">Pracovní doba:</p>
          {ORG.hours.map((h) => (
            <p key={h.day}>
              {h.day} {h.time}
            </p>
          ))}
        </div>
        <div className="text-sm">
          <h3 className="mb-2 text-base">Adresa</h3>
          <p>IČO: {ORG.ico}</p>
          <p>Sídlo: {ORG.seat}</p>
          <p>Kancelář: {ORG.office}</p>
          <p>ID datové schránky: {ORG.dataBox}</p>
        </div>
      </Container>
      <Container className="border-t border-border py-4 text-center text-xs text-ink-muted">
        © {new Date().getFullYear()} SOSvyzivne.cz
      </Container>
    </footer>
  );
}
