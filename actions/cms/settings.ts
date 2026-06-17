"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/server";

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/.+/i.test(v), {
    message: "Zadejte platnou URL začínající http(s)://",
  });

const settingsInput = z.object({
  facebookUrl: urlOrEmpty,
  instagramUrl: urlOrEmpty,
  linkedinUrl: urlOrEmpty,
});

function nullify(v: string): string | null {
  return v === "" ? null : v;
}

export async function updateSocialSettings(raw: unknown) {
  await requireAdmin();
  const data = settingsInput.parse(raw);
  const values = {
    facebookUrl: nullify(data.facebookUrl),
    instagramUrl: nullify(data.instagramUrl),
    linkedinUrl: nullify(data.linkedinUrl),
  };
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...values },
    update: values,
  });
  revalidatePath("/", "layout");
}
