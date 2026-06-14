"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/server";
import {
  contentInputDiscriminated as contentInput,
  type ContentInput,
} from "@/lib/cms/schemas";

/** Public URL for a content row, used to revalidate after publish. */
function publicPathFor(type: ContentInput["type"], slug: string): string | null {
  switch (type) {
    case "BLOG_POST":
      return `/blog/${slug}`;
    case "FAQ":
      return `/faq/${slug}`;
    default:
      return null;
  }
}

function revalidatePublic(type: ContentInput["type"], slug: string) {
  const p = publicPathFor(type, slug);
  if (p) revalidatePath(p);
  if (type === "BLOG_POST") {
    revalidatePath("/blog");
    revalidatePath("/"); // home "Novinky z blogu" teasers
  }
  if (type === "FAQ") revalidatePath("/faq");
  if (type === "ENDORSEMENT") revalidatePath("/"); // home "Spokojení klienti"
}

function toJsonField(
  value: Record<string, unknown> | null | undefined,
): Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue {
  if (value === null || value === undefined) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

export async function createContent(raw: unknown) {
  const session = await requireAdmin();
  const data = contentInput.parse(raw);

  const row = await db.content.create({
    data: {
      type: data.type,
      status: data.status,
      locale: data.locale,
      slug: data.slug,
      translationKey: data.translationKey,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      coverImage: data.coverImage,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage,
      data: toJsonField(data.data),
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorId: session.user.id,
    },
  });

  revalidatePath("/content");
  if (data.status === "PUBLISHED") revalidatePublic(row.type, row.slug);
  redirect(`/content/${row.id}/edit`);
}

export async function updateContent(id: string, raw: unknown) {
  await requireAdmin();
  const data = contentInput.parse(raw);

  const existing = await db.content.findUnique({ where: { id } });
  if (!existing) throw new Error("Obsah nenalezen.");

  const becamePublished =
    data.status === "PUBLISHED" && existing.status !== "PUBLISHED";

  const row = await db.content.update({
    where: { id },
    data: {
      type: data.type,
      status: data.status,
      locale: data.locale,
      slug: data.slug,
      translationKey: data.translationKey,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      coverImage: data.coverImage,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      ogImage: data.ogImage,
      data: toJsonField(data.data),
      publishedAt: becamePublished ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/content");
  revalidatePublic(row.type, row.slug);
  return row;
}

export async function deleteContent(id: string) {
  await requireAdmin();
  const row = await db.content.delete({ where: { id } });
  revalidatePath("/content");
  revalidatePublic(row.type, row.slug);
  return row;
}
