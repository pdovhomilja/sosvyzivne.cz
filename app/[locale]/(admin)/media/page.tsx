import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  let assets: Array<{ id: string; url: string; alt: string | null }> = [];
  try {
    assets = await db.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, alt: true },
      take: 60,
    });
  } catch {
    // DB not connected.
  }

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Média</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Nahrávání přes UploadThing (route <code>/api/uploadthing</code>). Připojte
        UPLOADTHING_TOKEN a doplňte uploader (komponenta media-library).
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {assets.map((a) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={a.id}
            src={a.url}
            alt={a.alt ?? ""}
            className="aspect-square w-full rounded-[var(--radius-sm)] border border-border object-cover"
          />
        ))}
        {assets.length === 0 && (
          <p className="col-span-full text-ink-muted">Zatím žádná média.</p>
        )}
      </div>
    </div>
  );
}
