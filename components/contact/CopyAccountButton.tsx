"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyAccountButton({ account }: { account: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <Button type="button" variant="outline" onClick={copy}>
      {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {copied ? "Zkopírováno" : "Kopírovat číslo účtu"}
    </Button>
  );
}
