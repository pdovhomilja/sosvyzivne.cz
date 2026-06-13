import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Czech-only today. Add "en" + messages/en.json to roll out a second locale
  // without structural changes (see docs/07 §4).
  locales: ["cs"],
  defaultLocale: "cs",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
