type ContentType = "BLOG_POST" | "FAQ" | "PAGE" | "ENDORSEMENT";

/**
 * Public pages to revalidate after a content change. Pages live under
 * app/[locale] and are ISR-cached, so paths carry the locale segment
 * (/blog/x is a rewrite of /cs/blog/x with localePrefix "as-needed").
 */
export function publicPathsToRevalidate(type: ContentType, slug: string, locales: readonly string[]): string[] {
  const paths: string[] = [];
  for (const l of locales) {
    if (type === "BLOG_POST") paths.push(`/${l}/blog/${slug}`, `/${l}/blog`, `/${l}`);
    if (type === "FAQ") paths.push(`/${l}/faq/${slug}`, `/${l}/faq`);
    if (type === "ENDORSEMENT") paths.push(`/${l}`);
  }
  return paths;
}
