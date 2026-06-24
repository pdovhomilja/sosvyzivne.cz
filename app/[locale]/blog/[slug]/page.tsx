import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RichText } from "@/components/cms/RichText";
import { getPostBySlug, getLatestPosts } from "@/lib/cms/blog";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";
import { Calendar, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug).catch(() => null);
  if (!post) return { title: "Článek nenalezen – SOS výživné" };
  const ogImage = post.ogImage ?? post.coverImage ?? undefined;
  return {
    title: `${post.metaTitle ?? post.title} – SOS výživné`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

const articleImages = pageImages("article");

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(locale, slug).catch(() => null);
  if (!post || post.status !== "PUBLISHED") notFound();

  const related = await getLatestPosts(locale, 4)
    .then((posts) => posts.filter((p) => p.slug !== slug).slice(0, 3))
    .catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };

  const publishedLabel = post.publishedAt
    ? post.publishedAt.toLocaleDateString("cs-CZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* Breadcrumb & Hero */}
      <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 pt-12 pb-8">
        <nav
          className="mb-8 text-ink-muted text-sm flex items-center flex-wrap gap-1"
          aria-label="Drobečková navigace"
        >
          <Link
            href="/"
            className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
          >
            Domů
          </Link>
          <span className="mx-1 select-none" aria-hidden="true">›</span>
          <Link
            href="/blog"
            className="hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-primary rounded"
          >
            Blog
          </Link>
          <span className="mx-1 select-none" aria-hidden="true">›</span>
          <span className="text-ink">{post.title}</span>
        </nav>

        <header className="max-w-[800px] mx-auto text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-ink-muted text-sm flex-wrap">
            <span className="font-medium">Redakce SOS výživné</span>
            {publishedLabel && (
              <>
                <span
                  className="w-1 h-1 rounded-full bg-hairline"
                  aria-hidden="true"
                />
                <span className="flex items-center gap-1">
                  <Calendar size={14} aria-hidden="true" />
                  {publishedLabel}
                </span>
              </>
            )}
          </div>
        </header>
      </section>

      {/* Cover image — only when the post has one */}
      {post.coverImage && (
        <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 pb-12">
          <div className="mx-auto max-w-[800px] aspect-[16/9] overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Article body — single column, prose width */}
      <section className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 pb-24">
        <article className="mx-auto max-w-[720px]">
          <RichText html={post.body} className="mt-0 prose-cms" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </article>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-surface-subtle py-20 border-y border-hairline">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <h2 className="font-heading text-4xl font-bold text-center text-ink mb-12">
              Mohlo by vás zajímat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((article, idx) => {
                const img = articleImages[idx];
                return (
                  <div
                    key={article.slug}
                    className="bg-white rounded-xl overflow-hidden shadow-sm group hover:-translate-y-1 transition-all"
                  >
                    {(article.coverImage || img) && (
                      <div className="h-48 overflow-hidden relative">
                        {article.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Image
                            src={imgSrc(img)}
                            alt={altText(img)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold text-ink mb-3 leading-snug">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-ink-muted text-sm mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <Link
                        href={`/blog/${article.slug}`}
                        className="text-terracotta font-bold hover:underline flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-terracotta rounded"
                      >
                        Celý článek{" "}
                        <ChevronRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
