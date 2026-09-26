import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { NAV, HELP_CTA, FOOTER_HELP, FOOTER_FUND, ROUTES } from "@/lib/site/nav";

const appDir = path.resolve(__dirname, "../../app/[locale]");
function routeExists(href: string) {
  const clean = href.split("#")[0];
  if (clean === "/") return fs.existsSync(path.join(appDir, "page.tsx"));
  if (fs.existsSync(path.join(appDir, clean, "page.tsx"))) return true;
  // dynamic child, e.g. /jak-pomahame/vymahani-vyzivneho -> /jak-pomahame/[slug]/page.tsx
  const parent = path.join(appDir, path.dirname(clean));
  if (!fs.existsSync(parent)) return false;
  return fs
    .readdirSync(parent, { withFileTypes: true })
    .some((d) => d.isDirectory() && d.name.startsWith("[") && fs.existsSync(path.join(parent, d.name, "page.tsx")));
}

describe("site navigation", () => {
  it("every nav and footer href is a declared route", () => {
    for (const item of [...NAV, HELP_CTA, ...FOOTER_HELP, ...FOOTER_FUND]) {
      expect(ROUTES as readonly string[], item.href).toContain(item.href);
    }
  });
  it.skipIf(!process.env.CHECK_ROUTES)("every declared route has a page file", () => {
    for (const r of ROUTES) expect(routeExists(r), r).toBe(true);
  });
});
