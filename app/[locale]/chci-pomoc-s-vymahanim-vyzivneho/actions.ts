"use server";
import { z } from "zod";
import { getResend, EMAIL_FROM } from "@/lib/email/client";
import { ORG } from "@/lib/org";

const leadSchema = z.object({
  jmeno: z.string().min(2, "Zadejte jméno a příjmení.").max(120),
  email: z.email("Zadejte platný e-mail."),
  telefon: z.string().min(6, "Zadejte telefon.").max(40),
  psc: z.string().regex(/^\d{3}\s?\d{2}$/, "Zadejte platné PSČ."),
  zprava: z.string().max(2000).optional().default(""),
  souhlas: z.literal(true, { message: "Je nutný souhlas se zpracováním údajů." }),
  // Honeypot — must stay empty.
  website: z.string().max(0).optional().default(""),
});

export type LeadState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
};

export async function submitLead(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = leadSchema.safeParse({
    jmeno: formData.get("jmeno"),
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    psc: formData.get("psc"),
    zprava: formData.get("zprava") ?? "",
    souhlas: formData.get("souhlas") === "on",
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0])] = issue.message;
    }
    return { ok: false, errors, message: "Zkontrolujte prosím formulář." };
  }

  if (parsed.data.website) return { ok: true }; // bot caught by honeypot

  const { jmeno, email, telefon, psc, zprava } = parsed.data;
  const to = process.env.RESEND_TO_EMAIL ?? ORG.email;

  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to,
      replyTo: email,
      subject: `Nová žádost o pomoc – ${jmeno}`,
      text: `Jméno: ${jmeno}\nE-mail: ${email}\nTelefon: ${telefon}\nPSČ: ${psc}\n\nZpráva:\n${zprava}`,
    });
  } catch (err) {
    console.error("[LEAD] send failed:", err);
    return {
      ok: false,
      message: "Odeslání se nezdařilo. Zkuste to prosím znovu nebo zavolejte.",
    };
  }

  return { ok: true, message: "Děkujeme, ozveme se vám co nejdříve." };
}
