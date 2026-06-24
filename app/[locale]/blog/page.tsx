import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/ui/container";
import { getPublishedPosts } from "@/lib/cms/blog";
import { pageImages, imgSrc, altText } from "@/lib/stitch-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog – SOS výživné",
  description:
    "Články a aktuality o výživném, exekuci, náhradním výživném a péči o děti.",
};

const blogImages = pageImages("blog");

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  let data: Awaited<ReturnType<typeof getPublishedPosts>> = {
    items: [],
    total: 0,
    page,
    perPage: 9,
    pages: 0,
  };
  try {
    data = await getPublishedPosts({ locale, page });
  } catch (err) {
    console.error("[blog] failed to load published posts:", err);
  }

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-surface-subtle">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-ink mb-6">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-ink-muted leading-relaxed">
            Najděte užitečné rady, tipy a příběhy, které vám pomohou v náročné
            životní situaci. Jsme tu, abychom vás podpořili na cestě ke
            spravedlivému výživnému pro vaše děti.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <Section>
        {data.items.length === 0 ? (
          <p className="text-ink-muted">
            Zatím zde nejsou žádné články. Přidejte je v administraci (typ
            obsahu Blog).
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.items.map((p, i) => {
                const img = blogImages[i % blogImages.length];
                const formattedDate =
                  p.publishedAt
                    ? new Date(p.publishedAt).toLocaleDateString("cs-CZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : null;

                return (
                  <article
                    key={p.id}
                    className="flex flex-col group cursor-pointer rounded-lg overflow-hidden border border-transparent hover:border-hairline bg-white transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Thumbnail — post cover if set, otherwise illustrative stock image */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Image
                          src={imgSrc(img)}
                          alt={altText(img)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-col flex-1 p-6">
                      <h2 className="font-heading text-xl text-ink mb-3 leading-snug">
                        <Link
                          href={`/blog/${p.slug}`}
                          className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          {p.title}
                        </Link>
                      </h2>

                      {p.excerpt && (
                        <p className="text-sm text-ink-muted leading-relaxed line-clamp-3 mb-4">
                          {p.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        {formattedDate && (
                          <span className="text-xs text-ink-muted">
                            {formattedDate}
                          </span>
                        )}
                        <Link
                          href={`/blog/${p.slug}`}
                          className="text-primary font-bold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ml-auto"
                        >
                          Celý článek »
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <nav
                className="mt-20 flex justify-center items-center gap-2"
                aria-label="Stránkování"
              >
                {Array.from({ length: data.pages }, (_, i) => i + 1).map(
                  (n) => (
                    <Link
                      key={n}
                      href={n === 1 ? "/blog" : `/blog?page=${n}`}
                      aria-current={n === data.page ? "page" : undefined}
                      className={
                        n === data.page
                          ? "w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold shadow-md ring-2 ring-primary ring-offset-2 focus-visible:outline-none"
                          : "w-10 h-10 rounded-full flex items-center justify-center border border-hairline text-ink font-medium hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      }
                    >
                      {n}
                    </Link>
                  ),
                )}
              </nav>
            )}
          </>
        )}
      </Section>
    </>
  );
}
