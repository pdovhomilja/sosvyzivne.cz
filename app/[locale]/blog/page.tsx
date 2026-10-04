import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedPosts } from "@/lib/cms/blog";
import { IMG, type ImageKey } from "@/lib/site/images";
import { PageHead } from "@/components/site/PageHead";
import { Container } from "@/components/site/Container";
import { Accent } from "@/components/site/Accent";
import { PostCard } from "@/components/site/PostCard";

// Paginates via ?page=, so this list stays dynamic (spec §7); articles are ISR.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog – SOS výživné",
  description: "Články a aktuality o výživném, exekuci, náhradním výživném a péči o děti.",
};

const FALLBACK: ImageKey[] = ["blogWalk", "blogStreet", "heroPaperwork", "topicMomHug", "heroWindow", "topicPaperwork"];

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

  let data: Awaited<ReturnType<typeof getPublishedPosts>> = { items: [], total: 0, page, perPage: 9, pages: 0 };
  try {
    data = await getPublishedPosts({ locale, page });
  } catch (err) {
    console.error("[blog] failed to load published posts:", err);
  }

  return (
    <>
      <PageHead
        title={
          <>
            Co se mění a <Accent>co můžete udělat</Accent>
          </>
        }
        lead="Užitečné rady, novinky a vysvětlení k výživnému, exekucím a náhradnímu výživnému."
      />
      <Container className="pt-10 lg:pt-[72px]">
        {data.items.length === 0 ? (
          <p className="text-wine-muted">Nové články připravujeme. Mezitím se podívejte do poradny.</p>
        ) : (
          <>
            <div className="grid gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p, i) => {
                const fb = IMG[FALLBACK[i % FALLBACK.length]];
                const date = p.publishedAt
                  ? new Date(p.publishedAt).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" })
                  : "Blog";
                return (
                  <div key={p.id} className="flex flex-col gap-2">
                    <PostCard
                      href={`/blog/${p.slug}`}
                      title={p.title}
                      kicker={date}
                      image={p.coverImage ? { src: p.coverImage, alt: "" } : { src: fb.src, alt: "" }}
                    />
                    {p.excerpt && <p className="line-clamp-3 text-[15px] text-wine-muted">{p.excerpt}</p>}
                  </div>
                );
              })}
            </div>
            {data.pages > 1 && (
              <nav className="mt-16 flex flex-wrap items-center justify-center gap-2" aria-label="Stránkování">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={n === 1 ? "/blog" : `/blog?page=${n}`}
                    aria-current={n === data.page ? "page" : undefined}
                    className={
                      n === data.page
                        ? "flex h-11 w-11 items-center justify-center rounded-full bg-plum font-semibold text-[#FFF6EC]"
                        : "flex h-11 w-11 items-center justify-center rounded-full border border-[#E6D6C6] bg-white font-medium text-plum hover:bg-sand"
                    }
                  >
                    {n}
                  </Link>
                ))}
              </nav>
            )}
          </>
        )}
      </Container>
      <div className="h-[72px] lg:h-28" />
    </>
  );
}
