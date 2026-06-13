import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import db from "@/lib/db";
import { getResend, EMAIL_FROM } from "@/lib/email/client";
import { generateOTPEmail } from "@/lib/email/templates/otp-email";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET environment variable is required");
}
if (!process.env.BETTER_AUTH_URL) {
  throw new Error("BETTER_AUTH_URL environment variable is required");
}

async function sendVerificationOTP(email: string, otp: string): Promise<void> {
  // Only pre-invited, active admins may receive a code. Sign-up is disabled.
  const user = await db.user.findUnique({
    where: { email },
    select: { name: true, isAdmin: true, isActive: true },
  });
  if (!user || !user.isAdmin || !user.isActive) {
    throw new Error("Tento e-mail nemá přístup do administrace SOS výživné.");
  }

  const { subject, html, text } = generateOTPEmail({
    recipientName: user.name ?? email,
    otp,
  });

  await getResend().emails.send({ from: EMAIL_FROM, to: email, subject, html, text });
}

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  user: {
    additionalFields: {
      isAdmin: { type: "boolean", defaultValue: false, input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24h
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp }) => {
        await sendVerificationOTP(email, otp);
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: true,
    }),
  ],
});

export type Auth = typeof auth;
