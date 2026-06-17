"use client";
import { useState } from "react";
import { MapPin } from "lucide-react";

export function OfficeMap({ query, label }: { query: string; label: string }) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  if (loaded) {
    return (
      <iframe
        title={`Mapa – ${label}`}
        src={src}
        className="h-56 w-full border-0"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setLoaded(true)}
      className="h-56 w-full flex flex-col items-center justify-center gap-3 text-ink-muted hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <MapPin size={32} className="text-terracotta" aria-hidden="true" />
      <span className="text-sm font-medium">Zobrazit mapu — {label}</span>
      <span className="text-xs">Načtením mapy souhlasíte s cookies Google Maps</span>
    </button>
  );
}
