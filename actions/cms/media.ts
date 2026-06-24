"use server";
import { z } from "zod";
import { UTApi } from "uploadthing/server";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/server";

const utapi = new UTApi();

/** UploadThing file key is the last path segment of the stored ufsUrl. */
function fileKeyFromUrl(url: string): string | null {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).at(-1) ?? null;
  } catch {
    return null;
  }
}

export type MediaAssetListItem = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

/** List uploaded media assets for the in-form picker (newest first). */
export async function listMediaAssets(): Promise<MediaAssetListItem[]> {
  await requireAdmin();
  return db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, alt: true, width: true, height: true },
    take: 100,
  });
}

export type MediaUsage = {
  id: string;
  title: string;
  type: string;
  locale: string;
  slug: string;
};

/**
 * Find content that references this asset's URL — as a cover/OG image or
 * embedded in the TipTap HTML body — so the admin can be warned before a
 * delete breaks those links.
 */
export async function getMediaUsage(id: string): Promise<MediaUsage[]> {
  await requireAdmin();
  const asset = await db.mediaAsset.findUnique({
    where: { id },
    select: { url: true },
  });
  if (!asset) return [];

  const refs = await db.content.findMany({
    where: {
      OR: [
        { coverImage: asset.url },
        { ogImage: asset.url },
        { body: { contains: asset.url } },
      ],
    },
    select: { id: true, title: true, type: true, locale: true, slug: true },
    take: 50,
  });
  return refs;
}

export async function deleteMediaAsset(id: string) {
  await requireAdmin();
  const asset = await db.mediaAsset.findUnique({
    where: { id },
    select: { url: true },
  });
  if (!asset) return;

  const key = fileKeyFromUrl(asset.url);
  if (key) {
    try {
      await utapi.deleteFiles(key);
    } catch (err) {
      // The DB record still gets removed; the orphaned blob can be cleaned up
      // later in the UploadThing dashboard.
      console.error("[MEDIA] UploadThing delete failed:", err);
    }
  }
  await db.mediaAsset.delete({ where: { id } });
}

const altInput = z.object({
  id: z.string().min(1),
  alt: z.string().trim().max(300),
});

export async function updateMediaAlt(raw: unknown) {
  await requireAdmin();
  const { id, alt } = altInput.parse(raw);
  await db.mediaAsset.update({
    where: { id },
    data: { alt: alt === "" ? null : alt },
  });
}

const dimensionsInput = z.object({
  items: z
    .array(
      z.object({
        url: z.url(),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }),
    )
    .max(10),
});

/** Persist client-measured pixel dimensions after an upload completes. */
export async function setMediaDimensions(raw: unknown) {
  await requireAdmin();
  const { items } = dimensionsInput.parse(raw);
  await Promise.all(
    items.map((it) =>
      db.mediaAsset.updateMany({
        where: { url: it.url },
        data: { width: it.width, height: it.height },
      }),
    ),
  );
}
