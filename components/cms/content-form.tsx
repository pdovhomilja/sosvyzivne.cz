"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createContent, updateContent } from "@/actions/cms/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ContentValues = {
  id?: string;
  type: "BLOG_POST" | "FAQ" | "PAGE";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  order: number;
  category: string;
};

const EMPTY: ContentValues = {
  type: "BLOG_POST",
  status: "DRAFT",
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  metaTitle: "",
  metaDescription: "",
  order: 0,
  category: "",
};

export function ContentForm({ initial }: { initial?: Partial<ContentValues> }) {
  const router = useRouter();
  const [v, setV] = useState<ContentValues>({ ...EMPTY, ...initial });
  const [pending, start] = useTransition();
  const set = <K extends keyof ContentValues>(k: K, val: ContentValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));

  function save() {
    start(async () => {
      const payload = {
        type: v.type,
        status: v.status,
        locale: "cs",
        slug: v.slug,
        title: v.title,
        excerpt: v.excerpt || null,
        body: v.body,
        metaTitle: v.metaTitle || null,
        metaDescription: v.metaDescription || null,
        data:
          v.type === "FAQ"
            ? { order: Number(v.order) || 0, category: v.category || undefined }
            : null,
      };
      try {
        if (v.id) {
          await updateContent(v.id, payload);
          toast.success("Uloženo.");
          router.refresh();
        } else {
          await createContent(payload); // redirects to edit
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Uložení selhalo.");
      }
    });
  }

  const isFaq = v.type === "FAQ";

  return (
    <div className="max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="type">Typ</Label>
          <select
            id="type"
            value={v.type}
            onChange={(e) => set("type", e.target.value as ContentValues["type"])}
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border px-3"
          >
            <option value="BLOG_POST">Blog</option>
            <option value="FAQ">FAQ</option>
            <option value="PAGE">Stránka</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="status">Stav</Label>
          <select
            id="status"
            value={v.status}
            onChange={(e) =>
              set("status", e.target.value as ContentValues["status"])
            }
            className="h-11 w-full rounded-[var(--radius-sm)] border border-border px-3"
          >
            <option value="DRAFT">Koncept</option>
            <option value="PUBLISHED">Publikováno</option>
            <option value="ARCHIVED">Archivováno</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="title">{isFaq ? "Otázka" : "Nadpis"}</Label>
        <Input id="title" value={v.title} onChange={(e) => set("title", e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input id="slug" value={v.slug} onChange={(e) => set("slug", e.target.value)} />
      </div>

      {!isFaq && (
        <div className="space-y-1">
          <Label htmlFor="excerpt">Perex</Label>
          <Textarea
            id="excerpt"
            value={v.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
      )}

      {isFaq && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="order">Pořadí</Label>
            <Input
              id="order"
              type="number"
              value={v.order}
              onChange={(e) => set("order", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="category">Kategorie</Label>
            <Input
              id="category"
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="body">{isFaq ? "Odpověď" : "Obsah"} (HTML)</Label>
        {/* TODO: replace with TipTap editor (components/cms/tiptap-editor). */}
        <Textarea
          id="body"
          rows={12}
          value={v.body}
          onChange={(e) => set("body", e.target.value)}
        />
      </div>

      <details className="rounded-[var(--radius-sm)] border border-border p-3">
        <summary className="cursor-pointer text-sm font-medium">SEO</summary>
        <div className="mt-3 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="metaTitle">Meta title</Label>
            <Input
              id="metaTitle"
              value={v.metaTitle}
              onChange={(e) => set("metaTitle", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="metaDescription">Meta description</Label>
            <Textarea
              id="metaDescription"
              value={v.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
            />
          </div>
        </div>
      </details>

      <Button onClick={save} disabled={pending}>
        {pending ? "Ukládám…" : "Uložit"}
      </Button>
    </div>
  );
}
