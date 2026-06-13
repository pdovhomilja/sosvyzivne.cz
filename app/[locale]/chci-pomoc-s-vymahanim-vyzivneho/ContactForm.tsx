"use client";
import * as React from "react";
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
  children: React.ReactElement;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} className="font-bold text-sm text-ink px-1">
        {label}
      </Label>
      {error ? React.cloneElement(children, { "aria-describedby": `${name}-error`, "aria-invalid": true } as Record<string, unknown>) : children}
      {error && <p id={`${name}-error`} role="alert" className="text-sm text-error px-1">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitLead, initial);

  if (state.ok && state.message) {
    return (
      <div role="status" className="rounded-[var(--radius-md)] border border-success/40 bg-success/10 p-6">
        <p className="font-semibold text-success">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.message && !state.ok && (
        <p role="alert" className="rounded-[var(--radius-sm)] bg-error/10 p-3 text-sm text-error">
          {state.message}
        </p>
      )}

      {/* Name + Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field name="jmeno" label="Jméno a příjmení" error={state.errors?.jmeno}>
          <Input
            id="jmeno"
            name="jmeno"
            autoComplete="name"
            required
            placeholder="Např. Jana Nováková"
            className="px-4 py-3 border-hairline rounded-[var(--radius-md)] bg-surface-subtle transition-all"
          />
        </Field>
        <Field name="email" label="E-mail" error={state.errors?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="vas@email.cz"
            className="px-4 py-3 border-hairline rounded-[var(--radius-md)] bg-surface-subtle transition-all"
          />
        </Field>
      </div>

      {/* Phone + ZIP row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field name="telefon" label="Telefon" error={state.errors?.telefon}>
          <Input
            id="telefon"
            name="telefon"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+420 123 456 789"
            className="px-4 py-3 border-hairline rounded-[var(--radius-md)] bg-surface-subtle transition-all"
          />
        </Field>
        <Field name="psc" label="PSČ" error={state.errors?.psc}>
          <Input
            id="psc"
            name="psc"
            inputMode="numeric"
            required
            placeholder="120 00"
            className="px-4 py-3 border-hairline rounded-[var(--radius-md)] bg-surface-subtle transition-all"
          />
        </Field>
      </div>

      {/* Message */}
      <Field name="zprava" label="Zpráva" error={state.errors?.zprava}>
        <Textarea
          id="zprava"
          name="zprava"
          rows={4}
          placeholder="Stručně popište vaši situaci..."
          className="px-4 py-3 border-hairline rounded-[var(--radius-md)] bg-surface-subtle resize-none transition-all"
        />
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

      {/* GDPR consent */}
      <div className="flex items-start gap-3 py-2">
        <input
          id="souhlas"
          name="souhlas"
          type="checkbox"
          className="mt-1 w-5 h-5 rounded border-hairline text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          required
          {...(state.errors?.souhlas ? { "aria-describedby": "souhlas-error", "aria-invalid": true } : {})}
        />
        <Label htmlFor="souhlas" className="font-normal text-sm text-ink-muted leading-relaxed">
          Souhlasím se zpracováním osobních údajů za účelem vyřízení mé žádosti.
        </Label>
      </div>
      {state.errors?.souhlas && (
        <p id="souhlas-error" role="alert" className="text-sm text-error">{state.errors.souhlas}</p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Odesílám…" : "Chci pomoc"}
      </Button>
    </form>
  );
}
