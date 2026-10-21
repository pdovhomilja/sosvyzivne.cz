"use client";

import { useEffect } from "react";
import { readConsent, useConsent } from "@/lib/consent";

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;
const CALL_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALL_LABEL;
const CALC_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_CALC_LABEL;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/**
 * Sends a Google Ads conversion whatever the consent state; without marketing
 * consent Google receives a cookieless ping. No-op until the tag has loaded.
 */
function trackConversion(label: string | undefined) {
  if (!ADS_ID || !label || !window.gtag) return;
  window.gtag("event", "conversion", { send_to: `${ADS_ID}/${label}` });
}

/** Lead form sent successfully. */
export function trackLeadConversion() {
  trackConversion(LEAD_LABEL);
}

/** Calculator showed a result. */
export function trackCalculatorConversion() {
  trackConversion(CALC_LABEL);
}

/**
 * Google Ads tag (Ad Grants conversion tracking) in Consent Mode v2, advanced
 * mode. gtag.js loads for every visitor with all storage denied by default, so
 * without consent Google gets only cookieless pings; enabling "Marketing" in
 * the cookie banner grants ad storage, withdrawing it switches back to denied.
 * Counts clicks on any tel: link as a call conversion. With no
 * NEXT_PUBLIC_GOOGLE_ADS_ID set, this is a no-op.
 */
export function GoogleAdsTag() {
  const consent = useConsent();
  const marketingAllowed = consent?.marketing === true;

  useEffect(() => {
    if (!ADS_ID) return;
    const state = marketingAllowed ? "granted" : "denied";

    if (window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: state,
        ad_user_data: state,
        ad_personalization: state,
      });
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js expects the arguments object itself, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
    // A choice stored on an earlier visit applies before config; the first
    // render after hydration still sees the server snapshot (no consent).
    if (readConsent()?.marketing) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
    window.gtag("js", new Date());
    window.gtag("config", ADS_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
    document.head.appendChild(script);
  }, [marketingAllowed]);

  useEffect(() => {
    if (!ADS_ID) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.('a[href^="tel:"]')) {
        trackConversion(CALL_LABEL);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
