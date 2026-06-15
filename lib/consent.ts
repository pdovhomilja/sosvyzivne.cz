"use client";

import { useSyncExternalStore } from "react";

export type Consent = { analytics: boolean; marketing: boolean };

export const CONSENT_STORAGE_KEY = "sosvyzivne_consent";
export const CONSENT_OPEN_EVENT = "sosvyzivne:open-cookie-settings";
export const CONSENT_CHANGED_EVENT = "sosvyzivne:consent-changed";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean" && typeof parsed?.marketing === "boolean") {
      return { analytics: parsed.analytics, marketing: parsed.marketing };
    }
  } catch {
    // ignore malformed storage
  }
  return null;
}

export function persistConsent(consent: Consent) {
  const payload = JSON.stringify(consent);
  window.localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  document.cookie = `${CONSENT_STORAGE_KEY}=${encodeURIComponent(payload)}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
  // Notify the banner, PostHog, and any future analytics/marketing loaders.
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: consent }));
}

/** Dispatch the event that reopens the cookie preferences panel (used by the footer link). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Raw string snapshot keeps a stable identity for useSyncExternalStore (no re-render loops).
function getRawSnapshot(): string | null {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Reactive consent value. Server snapshot is null (no storage on the server);
 * consumers that must avoid an SSR/CSR mismatch should use {@link useHasStoredConsent}.
 */
export function useConsent(): Consent | null {
  const raw = useSyncExternalStore(subscribe, getRawSnapshot, () => null);
  // Parsing a primitive snapshot each render is cheap and keeps the store value stable.
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics === "boolean" && typeof parsed?.marketing === "boolean") {
      return { analytics: parsed.analytics, marketing: parsed.marketing };
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Whether a consent choice has been stored. Server snapshot is `true` so the
 * first-visit banner is never rendered into SSR HTML (avoids hydration flash).
 */
export function useHasStoredConsent(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => getRawSnapshot() !== null,
    () => true
  );
}
