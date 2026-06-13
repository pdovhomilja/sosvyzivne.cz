"use client";
import { useActionState } from "react";
import { submitLead, type LeadState } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const initial: LeadState = { ok: false };

function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initial);

  if (state.ok && state.message) {
    return (
      <div className="rounded-[var(--radius-md)] border border-success/40 bg-success/10 p-6">
        <p className="font-semibold text-success">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && !state.ok && (
        <p className="rounded-[var(--radius-sm)] bg-error/10 p-3 text-sm text-error">
          {state.message}
        </p>
      )}
      <Field name="jmeno" label="Jméno a příjmení" error={state.errors?.jmeno}>
        <Input id="jmeno" name="jmeno" autoComplete="name" required />
      </Field>
      <Field name="email" label="E-mail" error={state.errors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field name="telefon" label="Telefon" error={state.errors?.telefon}>
        <Input id="telefon" name="telefon" type="tel" autoComplete="tel" required />
      </Field>
      <Field name="psc" label="PSČ" error={state.errors?.psc}>
        <Input id="psc" name="psc" inputMode="numeric" required />
      </Field>
      <Field name="zprava" label="Zpráva" error={state.errors?.zprava}>
        <Textarea id="zprava" name="zprava" rows={5} />
      </Field>

      {/* Honeypot — hidden from users. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="flex items-start gap-2">
        <input id="souhlas" name="souhlas" type="checkbox" className="mt-1" required />
        <Label htmlFor="souhlas" className="font-normal">
          Souhlasím se zpracováním osobních údajů za účelem vyřízení mé žádosti.
        </Label>
      </div>
      {state.errors?.souhlas && (
        <p className="text-sm text-error">{state.errors.souhlas}</p>
      )}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Odesílám…" : "Chci pomoc"}
      </Button>
    </form>
  );
}
