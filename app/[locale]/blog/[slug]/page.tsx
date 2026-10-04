import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RichText } from "@/components/cms/RichText";
import { getPostBySlug, getLatestPosts } from "@/lib/cms/blog";
import { IMG, type ImageKey } from "@/lib/site/images";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { PostCard } from "@/components/site/PostCard";
import { SideCta } from "@/components/site/ServiceArticle";

export const revalidate = 3600;

// Pages build on first request and are cached; the build never needs the DB.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
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

const FALLBACK: ImageKey[] = ["blogWalk", "blogStreet", "heroPaperwork"];

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
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
    ? post.publishedAt.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <PageHead
        crumbs={[{ href: "/blog", label: "Blog" }]}
        title={post.title}
        lead={
          <p className="text-[15px] text-plum-2">
            Redakce SOS výživné{publishedLabel ? ` · ${publishedLabel}` : ""}
          </p>
        }
      />
      <Container className="grid items-start gap-10 pt-10 lg:grid-cols-[1.65fr_1fr] lg:gap-14 lg:pt-[72px]">
        <article className="min-w-0">
          {post.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage} alt="" className="mb-8 aspect-[16/9] w-full rounded-3xl object-cover" />
          )}
          <RichText html={post.body} className="prose-cms mt-0 max-w-[68ch]" />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </article>
        <SideCta />
      </Container>

      {related.length > 0 && (
        <Container className="pt-[72px] lg:pt-28">
          <h2 className="mb-8 text-[31px] font-semibold tracking-[-.03em] text-plum md:text-[40px]">Mohlo by vás zajímat</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((a, i) => {
              const fb = IMG[FALLBACK[i % FALLBACK.length]];
              return (
                <PostCard
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  title={a.title}
                  image={a.coverImage ? { src: a.coverImage, alt: "" } : { src: fb.src, alt: "" }}
                />
              );
            })}
          </div>
        </Container>
      )}
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
