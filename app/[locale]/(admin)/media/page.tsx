import db from "@/lib/db";
import {
  MediaLibrary,
  type MediaAssetView,
} from "@/components/admin/media-library";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let assets: MediaAssetView[] = [];
  try {
    assets = await db.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, alt: true, width: true, height: true },
      take: 60,
    });
  } catch {
    // DB not connected.
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Média</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Nahrávejte obrázky pro web. Po nahrání zkopírujte URL tlačítkem a vložte
        ji do obsahu.
      </p>
      <div className="mt-6">
        <MediaLibrary assets={assets} />
      </div>
    </div>
  );
}
