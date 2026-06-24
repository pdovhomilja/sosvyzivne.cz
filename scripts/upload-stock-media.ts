import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { UTApi, UTFile } from "uploadthing/server";
import db from "../lib/db";
import manifest from "../public/images/stitch/manifest.json";

/**
 * One-off: push the bundled Stitch stock images into the UploadThing-backed
 * media library so admins can pick them as covers / inline images.
 *
 * Idempotent: skips any image whose alt text already exists as a MediaAsset,
 * so re-running won't create duplicates.
 *
 * Run: pnpm tsx scripts/upload-stock-media.ts
 */

type StitchImage = { file: string; alt: string; data_alt: string; url: string };
const STITCH_DIR = path.join(process.cwd(), "public", "images", "stitch");

/** Minimal JPEG SOF parser → natural pixel dimensions (best-effort). */
function jpegSize(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let off = 2;
  while (off + 9 < buf.length) {
    if (buf[off] !== 0xff) {
      off++;
      continue;
    }
    const marker = buf[off + 1];
    // Start-of-Frame markers carry the dimensions (skip DHT/JPG/DAC variants).
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    ) {
      return {
        height: buf.readUInt16BE(off + 5),
        width: buf.readUInt16BE(off + 7),
      };
    }
    off += 2 + buf.readUInt16BE(off + 2);
  }
  return null;
}

async function main() {
  const admin = await db.user.findFirst({
    where: { isAdmin: true, isActive: true },
    select: { id: true, email: true },
    orderBy: { createdAt: "asc" },
  });
  if (!admin) throw new Error("No active admin user to attribute uploads to.");

  // Flatten the manifest, de-duping files that appear under multiple pages.
  const pages = manifest as Record<string, StitchImage[]>;
  const byFile = new Map<string, StitchImage>();
  for (const entries of Object.values(pages)) {
    for (const e of entries) if (!byFile.has(e.file)) byFile.set(e.file, e);
  }
  const all = [...byFile.values()];

  // Skip anything already in the library (matched on alt text).
  const existing = await db.mediaAsset.findMany({ select: { alt: true } });
  const existingAlts = new Set(existing.map((a) => a.alt).filter(Boolean));

  const todo = all.filter((e) => {
    const alt = e.alt || e.data_alt || e.file;
    return !existingAlts.has(alt);
  });

  console.log(
    `Stock images: ${all.length} total · ${all.length - todo.length} already in library · ${todo.length} to upload`,
  );
  if (todo.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  const utapi = new UTApi();

  let ok = 0;
  let failed = 0;
  for (const entry of todo) {
    const alt = entry.alt || entry.data_alt || entry.file;
    try {
      const buf = await readFile(path.join(STITCH_DIR, entry.file));
      const dims = jpegSize(buf);
      const file = new UTFile([buf], entry.file, { type: "image/jpeg" });

      const res = await utapi.uploadFiles(file);
      if (res.error || !res.data) {
        failed++;
        console.error(`  ✗ ${entry.file}: ${res.error?.message ?? "no data"}`);
        continue;
      }
      const url = res.data.ufsUrl;

      await db.mediaAsset.create({
        data: {
          url,
          alt,
          mimeType: "image/jpeg",
          width: dims?.width ?? null,
          height: dims?.height ?? null,
          uploadedById: admin.id,
        },
      });
      ok++;
      console.log(`  ✓ ${entry.file} → ${url}`);
    } catch (err) {
      failed++;
      console.error(
        `  ✗ ${entry.file}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  console.log(`\nDone. Uploaded ${ok}, failed ${failed}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
