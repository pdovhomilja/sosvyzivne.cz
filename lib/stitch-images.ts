import manifest from "@/public/images/stitch/manifest.json";

export type StitchImage = {
  file: string;
  alt: string;
  data_alt: string;
  url: string;
};

type Manifest = Record<string, StitchImage[]>;

const data = manifest as Manifest;

/** Public path for a manifest entry, e.g. "/images/stitch/home-01-xxxx.jpg". */
export function imgSrc(entry: StitchImage): string {
  return `/images/stitch/${entry.file}`;
}

/** All image entries for a Stitch page, in document order. */
export function pageImages(page: keyof Manifest | string): StitchImage[] {
  return data[page] ?? [];
}

/** Best alt text: explicit alt, else a trimmed data_alt, else empty. */
export function altText(entry: StitchImage | undefined): string {
  if (!entry) return "";
  return entry.alt || entry.data_alt || "";
}
