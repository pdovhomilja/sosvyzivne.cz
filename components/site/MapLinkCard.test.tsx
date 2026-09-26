import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MapLinkCard } from "@/components/site/MapLinkCard";

describe("MapLinkCard", () => {
  it("is a plain link to mapy.cz for the office address (works without JS, no third-party cookies)", () => {
    const html = renderToStaticMarkup(<MapLinkCard address="Masarykovo nám. 1, 331 41 Kralovice" />);
    expect(html).toMatch(/^<a[^>]+href="https:\/\/mapy\.cz\/zakladni\?q=Masarykovo%20n%C3%A1m\.%201%2C%20331%2041%20Kralovice"/);
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("<button");
  });
});
