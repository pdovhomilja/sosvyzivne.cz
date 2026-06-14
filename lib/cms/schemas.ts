import { z } from "zod";

export const ContentTypeEnum = z.enum(["BLOG_POST", "FAQ", "PAGE", "ENDORSEMENT"]);
export const ContentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const slug = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Použijte malá písmena, číslice a pomlčky.");

export const contentInput = z.object({
  type: ContentTypeEnum,
  status: ContentStatusEnum,
  locale: z.string().min(2).max(8),
  slug,
  translationKey: z.string().max(120).optional().nullable(),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(1000).optional().nullable(),
  body: z.string(),
  coverImage: z.url().optional().nullable(),
  metaTitle: z.string().max(300).optional().nullable(),
  metaDescription: z.string().max(500).optional().nullable(),
  ogImage: z.url().optional().nullable(),
  data: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type ContentInput = z.infer<typeof contentInput>;

/** FAQ structured payload — manual ordering + optional category grouping. */
export const faqData = z.object({
  order: z.number().int().min(0).default(0),
  category: z.string().max(120).optional(),
});

export type FaqData = z.infer<typeof faqData>;

/** Endorsement structured payload — testimonial metadata for "Spokojení klienti". */
export const endorsementData = z.object({
  order: z.number().int().min(0).default(0),
  role: z.string().max(120).optional(),
  location: z.string().max(120).optional(),
  rating: z.number().int().min(1).max(5).default(5),
  consent: z.boolean().default(false),
});

export type EndorsementData = z.infer<typeof endorsementData>;

/** Validate the per-type `data` JSON, mapping issues onto the `data.*` path. */
export const contentInputDiscriminated = contentInput.superRefine((val, ctx) => {
  if (val.type === "FAQ" && val.data != null) {
    const r = faqData.safeParse(val.data);
    if (!r.success) {
      for (const issue of r.error.issues) {
        ctx.addIssue({ ...issue, path: ["data", ...issue.path] });
      }
    }
  }
  if (val.type === "ENDORSEMENT" && val.data != null) {
    const r = endorsementData.safeParse(val.data);
    if (!r.success) {
      for (const issue of r.error.issues) {
        ctx.addIssue({ ...issue, path: ["data", ...issue.path] });
      }
    }
  }
  // BLOG_POST and PAGE carry no required structured data.
});
