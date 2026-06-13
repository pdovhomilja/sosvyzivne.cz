"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { AGE_BRACKETS, estimateSupport } from "@/lib/calculator";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-8">
      {/* Income Input */}
      <div>
        <Label
          htmlFor="income"
          className="block text-sm font-semibold text-ink-muted mb-2"
        >
          Čistý měsíční příjem rodiče (Kč)
        </Label>
        <div className="relative">
          <input
            id="income"
            type="number"
            inputMode="numeric"
            placeholder="např. 25 000"
            value={income}
            onChange={(e) => setIncome(e.target.value.replace(/[^\d]/g, ""))}
            className="w-full bg-surface-subtle border border-hairline rounded-lg py-4 px-6 text-lg text-ink placeholder:text-ink-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-ink-muted font-medium pointer-events-none">
            Kč
          </span>
        </div>
      </div>

      <div className="h-px bg-hairline w-full" />

      {/* Child Rows */}
      <div className="space-y-6">
        {children.map((child, i) => (
          <div key={child.id}>
            <div className="flex justify-between items-end mb-3">
              <h3 className="font-bold text-ink">Dítě {i + 1}</h3>
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(child.id)}
                  className="flex items-center gap-1 text-terracotta text-sm font-medium hover:underline transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  aria-label={`Odebrat dítě ${i + 1}`}
                >
                  <X size={14} aria-hidden="true" />
                  odebrat
                </button>
              )}
            </div>
            <div>
              <Label
                htmlFor={`age-${child.id}`}
                className="block text-xs font-semibold text-ink-muted mb-1"
              >
                Věk dítěte
              </Label>
              <select
                id={`age-${child.id}`}
                value={child.pct}
                onChange={(e) =>
                  setChildPct(child.id, parseFloat(e.target.value))
                }
                className="w-full bg-surface-subtle border border-hairline rounded-lg py-3 px-4 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
              >
                {AGE_BRACKETS.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add Child Button */}
      <button
        type="button"
        onClick={addChild}
        className="w-full border-2 border-dashed border-peach text-terracotta font-bold py-4 rounded-xl hover:bg-peach-light hover:border-terracotta transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Plus size={20} aria-hidden="true" />
        Přidat dítě
      </button>

      {/* Calculate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={calculate}
          className="w-full bg-primary text-white py-5 rounded-full font-bold text-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Spočítat výživné
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-error text-sm font-medium" role="alert">
          {error}
        </p>
      )}

      {/* Result Card */}
      {result && (
        <div className="bg-peach-light border-2 border-peach rounded-2xl p-8 text-center">
          <p className="text-ink-muted text-sm font-semibold uppercase tracking-wider mb-2">
            Doporučená výše
          </p>
          <p className="text-3xl md:text-4xl font-heading text-ink font-bold mb-2">
            Celkové doporučené výživné:{" "}
            <span className="text-primary">
              {result.total.toLocaleString("cs-CZ")} Kč
            </span>
          </p>
          <p className="text-ink-muted text-sm italic">
            Skutečnou výši výživného určuje soud.
          </p>
        </div>
      )}
    </div>
  );
}
