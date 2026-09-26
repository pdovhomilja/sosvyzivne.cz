import { describe, it, expect } from "vitest";
import { assertVerifyAllowed } from "@/lib/verify";

const env = (e: Record<string, string>) => e as unknown as NodeJS.ProcessEnv;

// Production is self-hosted (not Vercel), so the guard must not depend on
// VERCEL_ENV: every production build fails unless a preview opts in.
describe("assertVerifyAllowed", () => {
  it("allows development", () => {
    expect(() => assertVerifyAllowed("x", env({ NODE_ENV: "development" }))).not.toThrow();
  });
  it("allows a production build that opts in for review (preview)", () => {
    expect(() => assertVerifyAllowed("x", env({ NODE_ENV: "production", ALLOW_UNVERIFIED: "1" }))).not.toThrow();
  });
  it("throws on a production build without the opt-in, wherever it is hosted", () => {
    expect(() => assertVerifyAllowed("promlčení", env({ NODE_ENV: "production" }))).toThrow(
      "Unverified claim rendered in production: promlčení",
    );
  });
  it("throws on Vercel production even if the opt-in leaked into its env", () => {
    expect(() =>
      assertVerifyAllowed("x", env({ NODE_ENV: "production", VERCEL_ENV: "production", ALLOW_UNVERIFIED: "1" })),
    ).toThrow();
  });
});
