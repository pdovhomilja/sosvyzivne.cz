/**
 * Single source of truth for organisation + contact details so the header,
 * footer, contact page, and JSON-LD never drift. See docs/03 + docs/05 §org.
 */
export const ORG = {
  legalName: "SOS výživné nadační fond",
  shortName: "SOS výživné",
  ico: "17850983",
  dataBox: "xg9bbex",
  seat: "Žihle 232, 331 65 Žihle",
  office: "Masarykovo nám. 1, 331 41 Kralovice",
  email: "info@sosvyzivne.cz",
  phone: "+420602842888",
  phoneDisplay: "+420 602 842 888",
  facebook: "https://www.facebook.com/SOSvyzivne",
  donationAccount: "131-1390040247/0100",
  contactPerson: "PhDr. Lenka Ranšová, DiS.",
  tagline: "Pomůžeme vám získat alimenty, na které máte právo!",
  // Thursday hours confirmed as 08:00–14:00 (discrepancy in docs/06 resolved).
  hours: [
    { day: "Pondělí", time: "08:00 – 16:00" },
    { day: "Čtvrtek", time: "08:00 – 14:00" },
  ],
} as const;
