import { notFound } from "next/navigation";
import { ContentForm } from "@/components/cms/content-form";
import { faqData } from "@/lib/cms/schemas";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await db.content.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();

  const faq = faqData.safeParse(row.data);

  return (
    <div>
      <h1 className="font-heading text-2xl text-accent">Upravit obsah</h1>
      <div className="mt-6">
        <ContentForm
          initial={{
            id: row.id,
            type: row.type,
            status: row.status,
            slug: row.slug,
            title: row.title,
            excerpt: row.excerpt ?? "",
            body: row.body,
            metaTitle: row.metaTitle ?? "",
            metaDescription: row.metaDescription ?? "",
            order: faq.success ? (faq.data.order ?? 0) : 0,
            category: faq.success ? (faq.data.category ?? "") : "",
          }}
        />
      </div>
    </div>
  );
}
