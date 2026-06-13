import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Legacy URL preservation — see docs/06-migration-and-seo.md.
  // Slugs are preserved 1:1; these handle dropped/duplicate/encoded paths.
  async redirects() {
    return [
      { source: "/test", destination: "/", permanent: true },
      // Duplicate FAQ/blog topic pairs and the corrupted encoded slug are
      // added here during content migration (see docs/06 §"Redirect map").
    ];
  },
};

export default withNextIntl(nextConfig);
