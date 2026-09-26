import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Accent } from "@/components/site/Accent";
import { isExternalHref } from "@/lib/site/href";

describe("primitives", () => {
  it("Accent renders italic serif span", () => {
    expect(renderToStaticMarkup(<Accent>nárok.</Accent>)).toContain("font-accent");
  });
  it("tel:, mailto: and http links are external, app paths are not", () => {
    expect(isExternalHref("tel:+420602842888")).toBe(true);
    expect(isExternalHref("mailto:info@sosvyzivne.cz")).toBe(true);
    expect(isExternalHref("https://mapy.cz")).toBe(true);
    expect(isExternalHref("/o-nas")).toBe(false);
  });
});
