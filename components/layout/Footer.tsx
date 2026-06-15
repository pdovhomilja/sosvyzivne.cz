import { Container } from "@/components/ui/container";
import { ORG } from "@/lib/org";
import { CookieSettingsLink } from "@/components/CookieConsent";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-subtle border-t border-hairline">
      <Container className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        {/* Brand column */}
        <div>
          <p className="font-heading text-xl text-primary font-bold mb-4">
            {ORG.shortName}
          </p>
          <p className="text-ink-muted text-sm leading-relaxed max-w-xs">
            {ORG.tagline}
          </p>
        </div>

        {/* Kontakt column */}
        <div className="space-y-3">
          <p className="font-bold text-ink mb-2">Kontakt</p>
          <div className="flex items-center gap-3 text-ink-muted">
            <Phone className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            <a href={`tel:${ORG.phone}`} className="hover:text-primary transition-colors text-sm">
              {ORG.phoneDisplay}
            </a>
          </div>
          <div className="flex items-center gap-3 text-ink-muted">
            <Mail className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            <a
              href={`mailto:${ORG.email}`}
              className="hover:text-primary transition-colors text-sm"
            >
              {ORG.email}
            </a>
          </div>
          <div className="pt-2">
            <p className="font-semibold text-ink text-sm mb-1">Pracovní doba:</p>
            {ORG.hours.map((h) => (
              <p key={h.day} className="text-sm text-ink-muted">
                {h.day}: {h.time}
              </p>
            ))}
          </div>
        </div>

        {/* Adresa column */}
        <div className="space-y-2">
          <p className="font-bold text-ink mb-2">Adresa</p>
          <div className="flex items-start gap-3 text-ink-muted">
            <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm space-y-1">
              <p className="font-medium">{ORG.legalName}</p>
              <p>IČO: {ORG.ico}</p>
              <p>Sídlo: {ORG.seat}</p>
              <p>Datová schránka: {ORG.dataBox}</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="bg-surface border-t border-hairline py-4">
        <Container className="flex flex-col items-center justify-center gap-2 text-center text-ink-muted text-sm sm:flex-row sm:gap-4">
          <span>© {new Date().getFullYear()} SOSvyzivne.cz</span>
          <CookieSettingsLink className="hover:text-primary transition-colors" />
        </Container>
      </div>
    </footer>
  );
}
