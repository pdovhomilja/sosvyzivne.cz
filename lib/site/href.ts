/** Links the browser handles itself (phone, e-mail, other sites) — not next-intl routes. */
export const isExternalHref = (href: string) => /^(tel:|mailto:|https?:)/.test(href);
