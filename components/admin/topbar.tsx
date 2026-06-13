"use client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function AdminTopbar({ email }: { email?: string | null }) {
  const router = useRouter();
  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <span className="text-sm text-ink-muted">{email}</span>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        Odhlásit se
      </Button>
    </div>
  );
}
