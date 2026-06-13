"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Stage = "email" | "otp";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("auth");
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? t("toast.sendError"));
      return;
    }
    toast.success(t("toast.codeSent"));
    setStage("otp");
  }

  async function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? t("toast.invalidCode"));
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-surface p-8">
      <h1 className="font-heading text-2xl text-accent">{t("title")}</h1>
      {stage === "email" ? (
        <form onSubmit={requestOtp} className="mt-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">{t("form.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("form.sending") : t("form.sendCode")}
          </Button>
        </form>
      ) : (
        <form onSubmit={submitOtp} className="mt-6 space-y-4">
          <p className="text-sm text-ink-muted">{t("form.codeSentTo", { email })}</p>
          <div className="space-y-1">
            <Label htmlFor="otp">{t("form.otpLabel")}</Label>
            <Input
              id="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || otp.length !== 6}
          >
            {loading ? t("form.verifying") : t("form.signIn")}
          </Button>
          <button
            type="button"
            className="text-sm text-ink-muted hover:underline"
            onClick={() => {
              setStage("email");
              setOtp("");
            }}
          >
            {t("form.useDifferentEmail")}
          </button>
        </form>
      )}
    </div>
  );
}
