"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function PromoRibbon() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-peach-light text-ink">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-center gap-3 px-4 py-2 text-sm">
        <Link
          href="/blog/nahradni-vyzivne-pomoc-proti-neplaticum"
          className="text-accent hover:underline"
        >
          Stát uhradí za neplatiče výživné → více informací
        </Link>
        <button
          aria-label="Zavřít upozornění"
          onClick={() => setOpen(false)}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X size={14} aria-hidden />
        </button>
      </div>
    </div>
  );
}
