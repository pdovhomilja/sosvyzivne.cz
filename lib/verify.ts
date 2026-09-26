/**
 * Unconfirmed claims render with a visible marker on dev and Vercel preview
 * (so Lenka can review them) but must never reach the live site.
 */
export function assertVerifyAllowed(label: string, env: NodeJS.ProcessEnv = process.env): void {
  if (env.VERCEL_ENV === "production") {
    throw new Error(`Unverified claim rendered in production: ${label}`);
  }
}
