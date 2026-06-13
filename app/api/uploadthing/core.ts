import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAdmin } from "@/lib/auth/server";
import db from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  // Admin-only image uploads for the CMS media library.
  mediaImage: f({ image: { maxFileSize: "8MB", maxFileCount: 10 } })
    .middleware(async () => {
      const session = await requireAdmin();
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.mediaAsset.create({
        data: {
          url: file.ufsUrl,
          mimeType: file.type,
          uploadedById: metadata.userId,
        },
      });
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
