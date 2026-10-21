import { describe, it, expect, vi, afterEach } from "vitest";

// The tag reads NEXT_PUBLIC_* at module load, so each test sets env, then imports fresh.
async function loadWithEnv(env: Record<string, string>) {
  vi.resetModules();
  for (const [k, v] of Object.entries(env)) vi.stubEnv(k, v);
  const gtag = vi.fn();
  vi.stubGlobal("window", { gtag });
  return { mod: await import("@/components/GoogleAdsTag"), gtag };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Google Ads conversions", () => {
  it("sends the calculator conversion to the calc label", async () => {
    const { mod, gtag } = await loadWithEnv({
      NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-1",
      NEXT_PUBLIC_GOOGLE_ADS_CALC_LABEL: "calcLabel",
    });
    mod.trackCalculatorConversion();
    expect(gtag).toHaveBeenCalledWith("event", "conversion", { send_to: "AW-1/calcLabel" });
  });

  it("does nothing when the calc label is not set", async () => {
    const { mod, gtag } = await loadWithEnv({ NEXT_PUBLIC_GOOGLE_ADS_ID: "AW-1" });
    mod.trackCalculatorConversion();
    expect(gtag).not.toHaveBeenCalled();
  });
});
