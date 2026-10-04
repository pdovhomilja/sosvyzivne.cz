import { describe, it, expect } from "vitest";
import { TEAM } from "@/lib/content/team";
import { IMG } from "@/lib/site/images";

describe("TEAM", () => {
  it("has the five people Lenka confirmed, with real portraits", () => {
    expect(TEAM.map((t) => t.name)).toEqual([
      "PhDr. Lenka Ranšová, DiS.",
      "Eva Koukolíková",
      "Mgr. Daniel Macek",
      "Mgr. Zuzana Bořutová",
      "JUDr. PhDr. Luděk Žákovec, Ph.D.",
    ]);
    for (const t of TEAM) expect(IMG[t.image].src).toMatch(/^\/images\/site\/team\//);
  });
});
