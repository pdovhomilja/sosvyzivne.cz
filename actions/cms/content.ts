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
import { publicPathsToRevalidate } from "@/lib/cms/revalidate-paths";
import { routing } from "@/i18n/routing";

function revalidatePublic(type: ContentInput["type"], slug: string) {
  for (const p of publicPathsToRevalidate(type, slug, routing.locales)) revalidatePath(p);
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
