"use client";
import { useState } from "react";
import { AGE_BRACKETS, estimateSupport } from "@/lib/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Child = { id: number; pct: number };

let nextId = 1;

export function Calculator() {
  const [income, setIncome] = useState("");
  const [children, setChildren] = useState<Child[]>([
    { id: nextId++, pct: AGE_BRACKETS[0].value },
  ]);
  const [result, setResult] = useState<{ total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addChild() {
    setChildren((c) => [...c, { id: nextId++, pct: AGE_BRACKETS[0].value }]);
  }
  function removeChild(id: number) {
    setChildren((c) => c.filter((ch) => ch.id !== id));
  }
  function setChildPct(id: number, pct: number) {
    setChildren((c) => c.map((ch) => (ch.id === id ? { ...ch, pct } : ch)));
  }

  function calculate() {
    const r = estimateSupport(parseFloat(income), children.map((c) => c.pct));
    if (!r.ok) {
      setError(r.error);
      setResult(null);
      return;
    }
    setError(null);
    setResult({ total: r.total });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="income">Čistý měsíční příjem rodiče (Kč):</Label>
        <Input
          id="income"
          inputMode="numeric"
          value={income}
          onChange={(e) => setIncome(e.target.value.replace(/[^\d]/g, ""))}
        />
      </div>

      <div className="space-y-3">
        {children.map((child, i) => (
          <div key={child.id} className="flex items-end gap-3">
            <div className="flex-1 space-y-1">
              <Label htmlFor={`age-${child.id}`}>Dítě {i + 1} – věk:</Label>
              <select
                id={`age-${child.id}`}
                value={child.pct}
                onChange={(e) => setChildPct(child.id, parseFloat(e.target.value))}
                className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3"
              >
                {AGE_BRACKETS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            {children.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeChild(child.id)}
              >
                Odebrat
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={addChild}>
          + Přidat dítě
        </Button>
      </div>

      <Button type="button" size="lg" onClick={calculate}>
        Spočítat výživné
      </Button>

      {error && <p className="text-error">{error}</p>}
      {result && (
        <div className="rounded-[var(--radius-md)] bg-secondary-tint p-6">
          <p className="text-lg">
            Celkové doporučené výživné:{" "}
            <strong className="text-2xl text-primary">
              {result.total.toLocaleString("cs-CZ")} Kč
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
