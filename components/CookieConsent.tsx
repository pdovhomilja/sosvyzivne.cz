"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  type Consent,
  CONSENT_OPEN_EVENT,
  openCookieSettings,
  persistConsent,
  readConsent,
  useHasStoredConsent,
} from "@/lib/consent";

/** Footer trigger that reopens the cookie preferences panel. */
export function CookieSettingsLink({ className }: { className?: string }) {
  const t = useTranslations("cookies");
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      {t("cookieSettings")}
    </button>
  );
}

export function CookieConsent() {
  const t = useTranslations("cookies");
  const consented = useHasStoredConsent();
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const openPreferences = useCallback(() => {
    const current = readConsent();
    setAnalytics(current?.analytics ?? false);
    setMarketing(current?.marketing ?? false);
    setPreferencesOpen(true);
  }, []);

  // Reopen preferences from the footer link.
  useEffect(() => {
    window.addEventListener(CONSENT_OPEN_EVENT, openPreferences);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, openPreferences);
  }, [openPreferences]);

  // Close preferences on Escape.
  useEffect(() => {
    if (!preferencesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreferencesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preferencesOpen]);

  const commit = useCallback((consent: Consent) => {
    persistConsent(consent);
    setPreferencesOpen(false);
  }, []);

  // Banner shows on first visit (no stored choice) unless the preferences panel is open.
  const showBanner = !consented && !preferencesOpen;

  if (!showBanner && !preferencesOpen) return null;

  if (showBanner) {
    return (
      <div
        role="region"
        aria-label={t("banner.title")}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface px-5 py-6 shadow-[0_-8px_30px_rgba(42,35,32,0.08)] md:px-12"
      >
        <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-heading text-lg font-bold text-accent">{t("banner.title")}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {t("banner.description")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openPreferences}
            >
              {t("banner.managePreferences")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => commit({ analytics: false, marketing: false })}
            >
              {t("banner.rejectAll")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => commit({ analytics: true, marketing: true })}
            >
              {t("banner.acceptAll")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // preferencesOpen === true
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("preferences.title")}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 px-4 py-6 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPreferencesOpen(false);
      }}
    >
      <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-[var(--radius-lg)] border border-hairline bg-surface p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-accent">
          {t("preferences.title")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {t("preferences.description")}
        </p>

        <div className="mt-6 space-y-3">
          <ConsentRow
            label={t("preferences.necessaryLabel")}
            description={t("preferences.necessaryDescription")}
            checked
            disabled
            badge={t("preferences.alwaysOn")}
          />
          <ConsentRow
            label={t("preferences.analyticsLabel")}
            description={t("preferences.analyticsDescription")}
            checked={analytics}
            onChange={setAnalytics}
          />
          <ConsentRow
            label={t("preferences.marketingLabel")}
            description={t("preferences.marketingDescription")}
            checked={marketing}
            onChange={setMarketing}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreferencesOpen(false)}
          >
            {t("preferences.close")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => commit({ analytics, marketing })}
          >
            {t("preferences.save")}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => commit({ analytics: true, marketing: true })}
          >
            {t("preferences.acceptAll")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  label,
  description,
  checked,
  disabled,
  badge,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  badge?: string;
  onChange?: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-hairline bg-surface-subtle p-4">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-primary disabled:opacity-60"
      />
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold text-ink">{label}</span>
          {badge ? (
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-ink-muted">{description}</span>
      </span>
    </label>
  );
}
