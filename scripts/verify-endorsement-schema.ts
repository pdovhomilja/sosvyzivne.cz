import "dotenv/config";
/**
 * Standalone check for the endorsement schema + row mapping.
 * Run: pnpm exec tsx scripts/verify-endorsement-schema.ts
 */
import { endorsementData } from "../lib/cms/schemas";
import { toEndorsementItem } from "../lib/cms/endorsements";
import assert from "node:assert/strict";

// Defaults apply when fields are missing.
const d = endorsementData.parse({});
assert.equal(d.order, 0);
assert.equal(d.rating, 5);
assert.equal(d.consent, false);

// Rating bounds are enforced.
assert.equal(endorsementData.safeParse({ rating: 6 }).success, false);
assert.equal(endorsementData.safeParse({ rating: 0 }).success, false);
assert.equal(endorsementData.safeParse({ rating: 3 }).success, true);

// Row mapping pulls name/quote/photo from columns and rating/role from data.
const item = toEndorsementItem({
  id: "c1",
  title: "Alena",
  body: "Skvělá pomoc.",
  coverImage: "https://example.com/a.jpg",
  data: { order: 2, role: "Maminka", location: "Brno", rating: 4, consent: true },
});
assert.equal(item.name, "Alena");
assert.equal(item.quote, "Skvělá pomoc.");
assert.equal(item.photo, "https://example.com/a.jpg");
assert.equal(item.rating, 4);
assert.equal(item.role, "Maminka");
assert.equal(item.location, "Brno");
assert.equal(item.order, 2);

// Bad/missing data falls back to safe defaults (no throw).
const fallback = toEndorsementItem({
  id: "c2",
  title: "Jana",
  body: "Děkuji.",
  coverImage: null,
  data: null,
});
assert.equal(fallback.rating, 5);
assert.equal(fallback.photo, undefined);
assert.equal(fallback.order, 0);

console.log("✓ endorsement schema + mapping OK");
