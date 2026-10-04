import { ORG } from "@/lib/org";

const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sosvyzivne.cz").replace(/\/+$/, "");

/** schema.org NGO description of the foundation, rendered in the root layout. */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: ORG.legalName,
    alternateName: ORG.shortName,
    url: base,
    logo: `${base}/logo/SOS_logo_compact-RGB.png`,
    taxID: ORG.ico,
    foundingDate: String(ORG.since),
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Masarykovo nám. 1",
      postalCode: "331 41",
      addressLocality: "Kralovice",
      addressCountry: "CZ",
    },
    sameAs: [ORG.facebook, ORG.instagram],
  };
}
