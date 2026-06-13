/**
 * Alimony (výživné) estimate calculator.
 *
 * Ported 1:1 from the legacy WordPress page so results match. Flat percentage
 * of net income per child by age bracket, summed, total rounded. NO sibling
 * reduction, no income cap. See docs/05 §"Alimony calculator".
 *
 * The legacy <select> option value IS the percentage.
 */
export const AGE_BRACKETS = [
  { value: 0.11, label: "0–5 let" },
  { value: 0.13, label: "6–9 let" },
  { value: 0.15, label: "10–14 let" },
  { value: 0.17, label: "15–17 let" },
  { value: 0.19, label: "18 a více let" },
] as const;

export type EstimateResult =
  | { ok: true; perChild: number[]; total: number }
  | { ok: false; error: string };

/** `children` = array of selected bracket percentages, e.g. [0.11, 0.17]. */
export function estimateSupport(
  netIncome: number,
  children: number[],
): EstimateResult {
  if (!Number.isFinite(netIncome) || netIncome <= 0) {
    return { ok: false, error: "Zadejte platný příjem." };
  }
  // Legacy rounds only the final total — match that for parity.
  const perChildRaw = children.map((pct) => netIncome * pct);
  const total = Math.round(perChildRaw.reduce((a, b) => a + b, 0));
  return { ok: true, perChild: perChildRaw.map(Math.round), total };
}
