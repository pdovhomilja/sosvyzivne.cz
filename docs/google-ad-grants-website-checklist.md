# Google Ad Grants — Website Policy Checklist & App Compliance Review

**Source:** [Google for Nonprofits — Website policy](https://support.google.com/nonprofits/answer/1657899)
**Reviewed app:** `sosvyzivne.cz` (Next.js 16, `feat/gdpr-consent-posthog`)
**Date:** 2026-06-17

> A high-quality, functional website is essential for participating in the Google Ad Grants
> program. Accounts found in violation are subject to **automatic suspension without
> notification**. Use this as a pre-application / pre-review audit.

---

## The Checklist

### 1. Domain ownership
- [ ] Nonprofit owns + has full administrative control of the domain(s) ads point to.
- [ ] `.org` is **not** required — `.cz`, `.com`, `.ngo`, etc. are fine if you own them.

### 2. Substantial & unique content
- [ ] Significant **original** content directly tied to the mission.
- [ ] No "thin content", no copied-without-value content.
- [ ] No pages that are just links / embeds without supporting text.
- [ ] No "Under Construction" or placeholder pages.
- [ ] Core info lives in **HTML pages**, not primarily in PDFs.
- [ ] Key pages well-developed: Home, About, Mission, Programs/Services, Contact.

### 3. Clear mission & activities
- [ ] Mission stated **prominently** (homepage / About).
- [ ] Programs, services, and impact clearly described.
- [ ] Nonprofit status visible — registration number (EIN/IČO) and/or annual report.

### 4. Easy navigation & functionality
- [ ] Clear, logical navigation menu.
- [ ] **No broken links** (404s, empty pages).
- [ ] All buttons work — **especially donation buttons**.

### 5. Fast loading speed
- [ ] Tested in [PageSpeed Insights](https://pagespeed.web.dev/) — esp. the **Mobile** score.
- [ ] Images optimized (WebP/JPG/PNG, compressed).
- [ ] Lightweight theme; minimal non-essential scripts/plugins.
- [ ] Browser caching + compression enabled.

### 6. Mobile-friendly design
- [ ] Responsive design across phones/tablets.
- [ ] Passes [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly).

### 7. Secure connection (HTTPS)
- [ ] Entire site served over HTTPS.
- [ ] Valid (non-expired) SSL certificate.
- [ ] **No mixed-content** (no HTTP images/scripts on HTTPS pages).
- [ ] HTTP → HTTPS auto-redirect.

### 8. Content & behavior restrictions
- [ ] No / minimal commercial focus — site centers on the mission.
- [ ] No AdSense or excessive third-party ads.
- [ ] Not primarily an affiliate-link / traffic-routing site.
- [ ] Financial info clearly presented.
- [ ] Donation links **work** and go to a **secure, dedicated** donation page.

---

## App Compliance Review

Legend: ✅ Pass · ⚠️ Needs attention · ❌ Fail · ❓ Verify at runtime

| # | Area | Status | Notes |
|---|------|--------|-------|
| 1 | Domain ownership | ✅ | `sosvyzivne.cz` owned by the fund. `.cz` is allowed. |
| 2 | Substantial & unique content | ✅ | Rich homepage (Hero, About, Audience cards, Steps, Blog teasers, Media, Testimonials) + Blog, FAQ, Calculator, Contact. Original Czech content. |
| 3 | Clear mission & activities | ✅ | Mission stated prominently in `AboutBlock` ("O nás"); nonprofit status + **IČO 17850983** in footer & contact; annual reports 2023/2024 linked. |
| 4 | Easy navigation & functionality | ⚠️ | Solid header/footer/mobile nav, but **non-functional UI elements** could read as "broken": see findings below. |
| 5 | Fast loading speed | ❓ | Good foundation (`next/font`, `next/image`). **Homepage uses `export const dynamic = "force-dynamic"`** — every visit is server-rendered, which can hurt TTFB/mobile score. Run PageSpeed Insights. |
| 6 | Mobile-friendly | ✅ | Responsive Tailwind + dedicated `MobileNav`. Run the Mobile-Friendly Test to confirm. |
| 7 | HTTPS | ❓→✅ | Site canonical is `https://www.sosvyzivne.cz` (Vercel auto-HTTPS). Confirm no mixed content and HTTP→HTTPS redirect in production. |
| 8 | Content & behavior restrictions | ✅ | No AdSense, no affiliate links. Donation = bank transfer to a **transparent account** on the HTTPS `/kontakt` page. Mission-focused. |

### Findings to address (priority order)

1. **⚠️ Disabled "search" button (Header).** `app`'s header renders a permanently
   `disabled`, `opacity-50` search button. A visibly dead control reads as a
   non-functional element. **Fix:** remove it until search works, or wire it up.

2. **⚠️ Donation "QR platba" is a placeholder (`/kontakt`).** A dashed box labeled
   "QR platba" with no real QR. The bank account itself works (copy button), but a
   placeholder on the primary donation surface is exactly what reviewers flag.
   **Fix:** generate a real SPD/QR payment code or remove the placeholder.

3. **⚠️ Map is a placeholder (`/kontakt`).** A "Kancelář Kralovice" box stands in for
   a real map. Low risk, but it's another empty/placeholder element. **Fix:** embed a
   real map or restyle as a plain address card (not a faux-map).

4. **❓ `force-dynamic` homepage performance.** Reconsider whether the homepage needs
   full dynamic rendering, or use ISR / cached blog fetch so the landing page (where
   ad clicks land) is fast on mobile.

5. **⚠️ Thursday office-hours discrepancy** (noted in `docs/06`, `lib/org.ts`): 14:00 vs
   16:00. Inconsistent info undermines the "accurate, high-quality" bar. Resolve.

6. **ℹ️ No dedicated Privacy Policy page.** A cookie-consent banner + PostHog exist, but
   there's no "Zásady ochrany osobních údajů" page linked in the footer. Not an Ad
   Grants website-policy requirement, but expected for GDPR and good standing. Add one.

### Good practices already in place
- `robots.ts` disallows admin/auth routes; `sitemap.ts` emits static + blog + FAQ URLs.
- Legacy WordPress URLs 301-redirected (preserves SEO equity).
- Org details centralized in `lib/org.ts` (header/footer/contact/JSON-LD can't drift).
- Consent-gated analytics (PostHog only after opt-in).

---

## Separate Ad Grants requirements (not website-policy, don't forget)
These live in other Ad Grants policies but cause suspensions just as fast:
- **Conversion tracking** must be active and meaningful (not just pageviews).
- **5% CTR** minimum maintained each month.
- **Valid conversions**, geo-targeting, and ≥2 ads per ad group / ≥2 ad groups per campaign.
- No single-word or overly generic keywords; keyword quality score ≥ 2.
