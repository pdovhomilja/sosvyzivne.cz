"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSocialSettings } from "@/actions/cms/settings";

type Values = {
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
};

export function SocialSettingsForm({ initial }: { initial: Values }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initial);
  const [loading, setLoading] = useState(false);

  function set(key: keyof Values) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSocialSettings(values);
      toast.success("Nastavení uloženo.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Uložení selhalo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-[var(--radius-md)] border border-border bg-surface p-6"
    >
      <div className="space-y-1">
        <Label htmlFor="facebookUrl">Facebook</Label>
        <Input
          id="facebookUrl"
          type="url"
          placeholder="https://www.facebook.com/…"
          value={values.facebookUrl}
          onChange={set("facebookUrl")}
          disabled={loading}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="instagramUrl">Instagram</Label>
        <Input
          id="instagramUrl"
          type="url"
          placeholder="https://www.instagram.com/…"
          value={values.instagramUrl}
          onChange={set("instagramUrl")}
          disabled={loading}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="linkedinUrl">LinkedIn</Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://www.linkedin.com/…"
          value={values.linkedinUrl}
          onChange={set("linkedinUrl")}
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Ukládání…" : "Uložit"}
      </Button>
    </form>
  );
}
