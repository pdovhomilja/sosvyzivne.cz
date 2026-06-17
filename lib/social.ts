import "server-only";
import { cache } from "react";
import db from "@/lib/db";
import { ORG } from "@/lib/org";

export type SocialLinks = {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
};

/** Seed values shown until the admin saves the singleton row for the first time. */
export const DEFAULT_SOCIALS: SocialLinks = {
  facebook: ORG.facebook,
  instagram: ORG.instagram,
  linkedin: null,
};

/**
 * Read social links. If the singleton row exists, its values are authoritative
 * (a cleared field stays null/hidden). If the row is missing or the DB errors,
 * fall back to DEFAULT_SOCIALS. `cache()` dedupes the query within one request
 * (header + footer both call this).
 */
export const getSocialSettings = cache(async (): Promise<SocialLinks> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SOCIALS;
    return {
      facebook: row.facebookUrl,
      instagram: row.instagramUrl,
      linkedin: row.linkedinUrl,
    };
  } catch (err) {
    // Table not migrated yet or DB outage — serve defaults, but log so the two
    // cases are distinguishable in ops.
    console.error("[social] getSocialSettings failed, using defaults:", err);
    return DEFAULT_SOCIALS;
  }
});
