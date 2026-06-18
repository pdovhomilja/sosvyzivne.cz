"use client";

import { useQueryState } from "nuqs";
import {
  contentFilterParser,
  CONTENT_FILTER_OPTIONS,
  statusFilterParser,
  STATUS_FILTER_OPTIONS,
} from "@/lib/cms/content-filter";

function Segmented<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm transition-colors ${
              active
                ? "bg-primary text-white"
                : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function ContentFilters() {
  // `shallow: false` so changing a filter triggers a server round-trip and the
  // list re-queries the DB with the new type/status.
  const [type, setType] = useQueryState(
    "type",
    contentFilterParser.withOptions({ shallow: false }),
  );
  const [status, setStatus] = useQueryState(
    "status",
    statusFilterParser.withOptions({ shallow: false }),
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Segmented
        ariaLabel="Filtr podle typu"
        value={type}
        options={CONTENT_FILTER_OPTIONS}
        onChange={setType}
      />
      <Segmented
        ariaLabel="Filtr podle stavu"
        value={status}
        options={STATUS_FILTER_OPTIONS}
        onChange={setStatus}
      />
    </div>
  );
}
