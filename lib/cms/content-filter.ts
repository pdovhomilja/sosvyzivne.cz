import { createLoader, parseAsStringLiteral } from "nuqs/server";

// ---------------------------------------------------------------------------
// Type filter (?type=...)
// ---------------------------------------------------------------------------

export const CONTENT_FILTERS = ["all", "blog", "faq", "endorsement"] as const;
export type ContentFilter = (typeof CONTENT_FILTERS)[number];

export const contentFilterParser =
  parseAsStringLiteral(CONTENT_FILTERS).withDefault("all");

// Labels shown in the filter (Czech, matching the rest of the admin UI).
export const CONTENT_FILTER_OPTIONS: { value: ContentFilter; label: string }[] =
  [
    { value: "all", label: "Vše" },
    { value: "blog", label: "Blog" },
    { value: "faq", label: "FAQ" },
    { value: "endorsement", label: "Reference" },
  ];

// Maps a filter value to its Prisma ContentType. "all" applies no type filter.
export const CONTENT_FILTER_TO_TYPE: Record<
  Exclude<ContentFilter, "all">,
  "BLOG_POST" | "FAQ" | "ENDORSEMENT"
> = {
  blog: "BLOG_POST",
  faq: "FAQ",
  endorsement: "ENDORSEMENT",
};

// ---------------------------------------------------------------------------
// Status filter (?status=...)
// ---------------------------------------------------------------------------

export const STATUS_FILTERS = [
  "all",
  "draft",
  "published",
  "archived",
] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const statusFilterParser =
  parseAsStringLiteral(STATUS_FILTERS).withDefault("all");

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Vše" },
  { value: "draft", label: "Koncept" },
  { value: "published", label: "Publikováno" },
  { value: "archived", label: "Archivováno" },
];

// Maps a filter value to its Prisma ContentStatus. "all" applies no filter.
export const STATUS_FILTER_TO_STATUS: Record<
  Exclude<StatusFilter, "all">,
  "DRAFT" | "PUBLISHED" | "ARCHIVED"
> = {
  draft: "DRAFT",
  published: "PUBLISHED",
  archived: "ARCHIVED",
};

// ---------------------------------------------------------------------------
// Shared server loader — parses both filters from the request searchParams.
// ---------------------------------------------------------------------------

export const contentFilterSearchParams = {
  type: contentFilterParser,
  status: statusFilterParser,
};
export const loadContentFilter = createLoader(contentFilterSearchParams);
