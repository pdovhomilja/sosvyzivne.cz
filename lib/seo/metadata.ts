import type { Metadata } from "next";

/**
 * Builds consistent Open Graph + Twitter card metadata. Falls back to the
 * site-wide /og.jpeg. Relative image URLs resolve against `metadataBase`
 * (set in the root locale layout).
 */
export function socialMetadata(opts: {
  title: string;
  description?: string | null;
  image?: string | null;
  locale: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const { title, description, image, locale, type = "website" } = opts;
  const desc = description ?? undefined;
  const images = [
    image
      ? { url: image, alt: title }
      : { url: "/og.jpeg", width: 1280, height: 672, alt: title },
  ];
  return {
    openGraph: {
      title,
      description: desc,
      siteName: "SOS výživné",
      type,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images,
    },
  };
}
