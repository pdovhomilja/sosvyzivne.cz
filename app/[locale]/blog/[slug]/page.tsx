import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { RichText } from "@/components/cms/RichText";
import { getPostBySlug } from "@/lib/cms/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug).catch(() => null);
  if (!post) return { title: "Článek nenalezen – SOS výživné" };
  return {
    title: `${post.metaTitle ?? post.title} – SOS výživné`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(locale, slug).catch(() => null);
  if (!post || post.status !== "PUBLISHED") notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  return (
    <Section>
      <article className="mx-auto max-w-2xl">
        <nav className="text-sm text-ink-muted">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          ›
        </nav>
        <h1 className="mt-2 text-3xl sm:text-4xl">{post.title}</h1>
        {post.publishedAt && (
          <p className="mt-2 text-sm text-ink-muted">
            {post.publishedAt.toLocaleDateString("cs-CZ")}
          </p>
        )}
        <RichText html={post.body} className="mt-6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </article>
    </Section>
  );
}
