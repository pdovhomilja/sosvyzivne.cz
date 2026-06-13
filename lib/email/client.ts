import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Lazily construct the Resend client so a missing key doesn't crash at import
 * time (and thus at build / page-data collection). Throws only when an email
 * is actually sent without configuration.
 */
export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set — cannot send email.");
  if (!client) client = new Resend(key);
  return client;
}

export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL ?? "SOS výživné <noreply@sosvyzivne.cz>";
