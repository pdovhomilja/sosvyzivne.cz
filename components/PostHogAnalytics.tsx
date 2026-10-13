"use client";

import { useEffect, useRef } from "react";
import type { PostHog } from "posthog-js";
import { useConsent } from "@/lib/consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

/** Captures a custom event. No-op unless PostHog has been initialized (analytics consent). */
export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (!POSTHOG_KEY) return;
  void import("posthog-js").then(({ default: posthog }) => {
    if (posthog.__loaded) posthog.capture(event, properties);
  });
}

/**
 * Consent-gated PostHog loader. posthog-js is dynamically imported (its own
 * chunk) only after the visitor enables "Analytics" in the cookie banner — so
 * for everyone else nothing is downloaded, initialized, or sent. Withdrawing
 * consent opts out and clears stored identifiers. With no NEXT_PUBLIC_POSTHOG_KEY
 * set, this is a no-op.
 *
 * Pageviews (including SPA route changes) are captured automatically by the
 * `defaults` config, so no manual pathname tracking is required.
 */
export function PostHogAnalytics() {
  const consent = useConsent();
  const analyticsAllowed = consent?.analytics === true;
  const posthogRef = useRef<PostHog | null>(null);

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    let cancelled = false;

    if (analyticsAllowed) {
      if (posthogRef.current) {
        posthogRef.current.opt_in_capturing();
      } else {
        void import("posthog-js").then(({ default: posthog }) => {
          if (cancelled) return;
          posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            defaults: "2025-05-24",
            person_profiles: "identified_only",
          });
          posthogRef.current = posthog;
        });
      }
    } else if (posthogRef.current) {
      posthogRef.current.opt_out_capturing();
      posthogRef.current.reset();
    }

    return () => {
      cancelled = true;
    };
  }, [analyticsAllowed]);

  // Phone link clicks (header, footer, contact page, service pages).
  useEffect(() => {
    if (!POSTHOG_KEY || !analyticsAllowed) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href^="tel:"]')) {
        captureEvent("phone_clicked", { path: window.location.pathname });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [analyticsAllowed]);

  return null;
}
