import { describe, it, expect } from "vitest";
import { orgJsonLd } from "@/lib/seo/org-jsonld";

describe("orgJsonLd", () => {
  it("describes the nonprofit with IČO and address", () => {
    const j = orgJsonLd();
    expect(j["@type"]).toBe("NGO");
    expect(j.taxID).toBe("17850983");
    expect(JSON.stringify(j)).toContain("Kralovice");
  });
});
