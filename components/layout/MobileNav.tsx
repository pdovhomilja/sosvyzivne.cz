"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Item = { href: string; label: string };

export function MobileNav({
  items,
  calculatorLabel,
  getHelpLabel,
}: {
  items: Item[];
  calculatorLabel: string;
  getHelpLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Otevřít menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <Menu aria-hidden />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col gap-6 bg-surface p-6 shadow-xl focus:outline-none">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-heading text-lg text-accent">Menu</Dialog.Title>
            <Dialog.Description className="sr-only">Navigační menu webu</Dialog.Description>
            <Dialog.Close
              aria-label="Zavřít menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X aria-hidden />
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-4 text-lg">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="text-ink hover:text-accent" onClick={() => setOpen(false)}>
                {it.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3">
            <Button asChild variant="outline">
              <Link href="/kalkulacka" onClick={() => setOpen(false)}>{calculatorLabel}</Link>
            </Button>
            <Button asChild>
              <Link href="/chci-pomoc-s-vymahanim-vyzivneho" onClick={() => setOpen(false)}>{getHelpLabel}</Link>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
