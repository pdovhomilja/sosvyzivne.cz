"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing/client";
import {
  deleteMediaAsset,
  getMediaUsage,
  setMediaDimensions,
  updateMediaAlt,
} from "@/actions/cms/media";

export type MediaAssetView = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

/** Read an image's natural pixel size in the browser before upload. */
function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

export function MediaLibrary({ assets }: { assets: MediaAssetView[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const { startUpload, isUploading } = useUploadThing("mediaImage", {
    onUploadError: (e) => {
      toast.error(e.message || "Nahrávání selhalo.");
    },
  });

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    try {
      const dims = await Promise.all(files.map(getImageDimensions));
      const res = await startUpload(files);
      if (!res) return;

      // Records were created server-side on upload; backfill their dimensions.
      const items = res
        .map((r, i) => ({
          url: r.serverData.url,
          width: dims[i]?.width ?? 0,
          height: dims[i]?.height ?? 0,
        }))
        .filter((it) => it.url && it.width > 0 && it.height > 0);
      if (items.length > 0) {
        try {
          await setMediaDimensions({ items });
        } catch {
          // Dimensions are best-effort metadata — never block the upload on them.
        }
      }

      toast.success(
        res.length === 1
          ? "Soubor nahrán."
          : `${res.length} souborů nahráno.`,
      );
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nahrávání selhalo.");
    }
  }

  return (
    <div className="space-y-6">
      <div
        role="button"
        tabIndex={0}
        aria-disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-accent bg-secondary-tint" : "border-border",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <UploadCloud className="size-8 text-accent" />
        <p className="text-sm font-medium text-ink">
          {isUploading
            ? "Nahrávání…"
            : "Přetáhněte obrázky sem nebo klikněte pro výběr"}
        </p>
        <p className="text-xs text-ink-muted">
          JPG, PNG, GIF, WebP · max 8 MB · až 10 souborů
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {assets.length === 0 ? (
        <p className="text-ink-muted">Zatím žádná média.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <MediaCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function MediaCard({ asset }: { asset: MediaAssetView }) {
  const router = useRouter();
  const [alt, setAlt] = useState(asset.alt ?? "");
  const [busy, setBusy] = useState(false);

  const dirty = alt.trim() !== (asset.alt ?? "");

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(asset.url);
      toast.success("URL zkopírována.");
    } catch {
      toast.error("Kopírování selhalo.");
    }
  }

  async function saveAlt() {
    if (!dirty) return;
    setBusy(true);
    try {
      await updateMediaAlt({ id: asset.id, alt });
      toast.success("Popisek uložen.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Uložení selhalo.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const usage = await getMediaUsage(asset.id);
      let message = "Opravdu smazat tento soubor?";
      if (usage.length > 0) {
        const list = usage
          .slice(0, 5)
          .map((u) => `• ${u.title} (${u.type})`)
          .join("\n");
        const more =
          usage.length > 5 ? `\n• …a ${usage.length - 5} dalších` : "";
        message =
          `Tento obrázek je použit v obsahu:\n${list}${more}\n\n` +
          "Smazáním se tyto odkazy rozbijí. Přesto pokračovat?";
      }
      if (!window.confirm(message)) {
        setBusy(false);
        return;
      }
      await deleteMediaAsset(asset.id);
      toast.success("Soubor smazán.");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Smazání selhalo.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-surface p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.url}
        alt={asset.alt ?? ""}
        className="aspect-square w-full rounded-[var(--radius-sm)] border border-border object-cover"
      />
      {asset.width && asset.height ? (
        <p className="text-xs text-ink-muted">
          {asset.width} × {asset.height} px
        </p>
      ) : null}
      <Input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        onBlur={saveAlt}
        placeholder="Alt popisek"
        disabled={busy}
        aria-label="Alt popisek"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={copyUrl}
          disabled={busy}
        >
          <Copy className="size-4" /> URL
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
          disabled={busy}
          aria-label="Smazat soubor"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
