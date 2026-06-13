import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";

export function BlogTeasers({
  posts,
}: {
  posts: { id: string; slug: string; title: string; excerpt: string | null }[];
}) {
  if (posts.length === 0) return null;

  const imgs = pageImages("home");
  // Blog teasers use images starting at index 5 (home has 8 total: 0-7)
  const teaseImgs = [imgs[5], imgs[6], imgs[7]];

  return (
    <section className="py-24 bg-surface-muted">
      <Container>
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-4xl text-ink">Novinky z blogu</h2>
          <Link
            href="/blog"
            className="text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Zobrazit vše
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => {
            const img = teaseImgs[i % teaseImgs.length];
            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={imgSrc(img)}
                    alt={altText(img)}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 leading-snug">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-ink-muted text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary font-bold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                  >
                    Celý článek »
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
