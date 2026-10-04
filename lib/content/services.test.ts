import { describe, it, expect } from "vitest";
import { SERVICES, getService } from "@/lib/content/services";
import { ROUTES } from "@/lib/site/nav";

describe("SERVICES", () => {
  it("covers the five service routes exactly", () => {
    const routes = SERVICES.map((s) => `/jak-pomahame/${s.slug}`).sort();
    expect(routes).toEqual(ROUTES.filter((r) => r.startsWith("/jak-pomahame/")).sort());
  });
  it("every service has content in each block", () => {
    for (const s of SERVICES) {
      expect(s.when.length && s.need.length && s.flow.length && s.faq.length, s.slug).toBeTruthy();
    }
  });
  it("getService returns undefined for unknown slug", () => {
    expect(getService("neexistuje")).toBeUndefined();
  });
});
