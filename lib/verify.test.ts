import { describe, it, expect } from "vitest";
import { assertVerifyAllowed } from "@/lib/verify";

describe("assertVerifyAllowed", () => {
  it("allows development", () => {
    expect(() => assertVerifyAllowed("x", { NODE_ENV: "development" } as NodeJS.ProcessEnv)).not.toThrow();
  });
  it("allows Vercel preview (production build, preview env)", () => {
    expect(() =>
      assertVerifyAllowed("x", { NODE_ENV: "production", VERCEL_ENV: "preview" } as NodeJS.ProcessEnv),
    ).not.toThrow();
  });
  it("throws on live production", () => {
    expect(() =>
      assertVerifyAllowed("promlčení", { NODE_ENV: "production", VERCEL_ENV: "production" } as NodeJS.ProcessEnv),
    ).toThrow("Unverified claim rendered in production: promlčení");
  });
});
