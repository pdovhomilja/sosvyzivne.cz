import { describe, it, expect } from "vitest";
import { TEAM } from "@/lib/content/team";
import { IMG } from "@/lib/site/images";

describe("TEAM", () => {
  it("has the six people from Výroční zpráva 2025 with real portraits", () => {
    expect(TEAM.map((t) => t.name)).toEqual([
      "PhDr. Lenka Ranšová, DiS.",
      "Erik Žákovec",
      "Eva Koukolíková",
      "Mgr. Daniel Macek",
      "Mgr. Zuzana Bořutová",
      "JUDr. PhDr. Luděk Žákovec, Ph.D.",
    ]);
    for (const t of TEAM) expect(IMG[t.image].src).toMatch(/^\/images\/site\/team\//);
  });
});
