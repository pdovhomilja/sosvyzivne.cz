import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./lib/legacy-redirects";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Legacy URL preservation — see docs/06-migration-and-seo.md.
  // Old WordPress URLs served blog posts + FAQ answers at the root (/slug/);
  // these 301 them to /blog/slug and /faq/slug. Slugs are preserved 1:1.
  async redirects() {
    return [
      { source: "/test", destination: "/", permanent: true },
      ...legacyRedirects(),
    ];
  },
};

export default withNextIntl(nextConfig);
