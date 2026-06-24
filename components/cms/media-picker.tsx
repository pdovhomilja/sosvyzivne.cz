"use client";
import { useEffect, useState } from "react";
import { Images, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  listMediaAssets,
  type MediaAssetListItem,
} from "@/actions/cms/media";

/**
 * Lets an admin pick an already-uploaded image from the media library.
 * Pairs with the file uploader on a form — uploads auto-create library
 * records, so anything uploaded here also appears in this picker.
 */
export function MediaPicker({
  onChange,
  label = "Vybrat z knihovny",
}: {
  onChange: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetListItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function openPicker() {
    setOpen(true);
    if (assets) return; // already loaded once this mount
    setLoading(true);
    try {
      setAssets(await listMediaAssets());
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={openPicker}>
        <Images className="size-4" /> {label}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Knihovna médií"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-surface">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-heading text-lg text-accent">
                Knihovna médií
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setOpen(false)}
                aria-label="Zavřít"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="overflow-y-auto p-4">
              {loading ? (
                <p className="text-sm text-ink-muted">Načítání…</p>
              ) : !assets || assets.length === 0 ? (
                <p className="text-sm text-ink-muted">
                  Zatím žádná média. Nahrajte obrázky v sekci Média nebo přímo
                  zde tlačítkem pro nahrání.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {assets.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onChange(a.url);
                        setOpen(false);
                      }}
                      title={a.alt ?? ""}
                      className="group overflow-hidden rounded-[var(--radius-sm)] border border-border focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.url}
                        alt={a.alt ?? ""}
                        className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
