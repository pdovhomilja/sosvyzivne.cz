import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { IMG } from "@/lib/site/images";

describe("image registry", () => {
  it("every image file exists, has alt text and real dimensions", () => {
    for (const [key, img] of Object.entries(IMG)) {
      expect(fs.existsSync(path.join(__dirname, "../../public", img.src)), key).toBe(true);
      expect(img.alt.length, key).toBeGreaterThan(3);
      expect(img.width * img.height, key).toBeGreaterThan(0);
    }
  });
});
