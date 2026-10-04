/**
 * Unconfirmed claims render with a visible marker in development and on review
 * builds, but must never reach the live site. Production is self-hosted, so a
 * production build fails unless the review build opts in with ALLOW_UNVERIFIED=1
 * (never set that on the live server).
 */
export function assertVerifyAllowed(label: string, env: NodeJS.ProcessEnv = process.env): void {
  const production = env.NODE_ENV === "production";
  const optedIn = env.ALLOW_UNVERIFIED === "1" && env.VERCEL_ENV !== "production";
  if (production && !optedIn) {
    throw new Error(`Unverified claim rendered in production: ${label}`);
  }
}
