import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { REPORTS, getReport } from "@/lib/content/annual-reports";

describe("REPORTS", () => {
  it("has 2025, 2024, 2023 newest first", () => {
    expect(REPORTS.map((r) => r.year)).toEqual([2025, 2024, 2023]);
  });
  it("each report is substantial HTML content and links an existing PDF", () => {
    for (const r of REPORTS) {
      expect(fs.existsSync(path.join(__dirname, "../../public", r.pdf)), r.pdf).toBe(true);
      expect(r.intro.join(" ").length, `${r.year} intro`).toBeGreaterThan(400);
      expect(r.highlights.length, `${r.year} highlights`).toBeGreaterThan(2);
      expect(r.finance.length, `${r.year} finance`).toBeGreaterThan(2);
      expect(r.audit.length, `${r.year} audit`).toBeGreaterThan(20);
    }
  });
  it("getReport(1999) is undefined", () => {
    expect(getReport(1999)).toBeUndefined();
  });
});
