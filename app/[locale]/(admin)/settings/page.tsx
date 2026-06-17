import { getSocialSettings } from "@/lib/social";
import { SocialSettingsForm } from "@/components/admin/SocialSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const socials = await getSocialSettings();
  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Nastavení</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Odkazy na sociální sítě zobrazené v hlavičce a patičce webu.
      </p>
      <div className="mt-6 max-w-xl">
        <SocialSettingsForm
          initial={{
            facebookUrl: socials.facebook ?? "",
            instagramUrl: socials.instagram ?? "",
            linkedinUrl: socials.linkedin ?? "",
          }}
        />
      </div>
    </div>
  );
}
