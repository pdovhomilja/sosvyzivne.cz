import { setRequestLocale } from "next-intl/server";
import { getLatestPosts } from "@/lib/cms/blog";
import { getEndorsements } from "@/lib/cms/endorsements";
import { PromoRibbon } from "@/components/layout/PromoRibbon";
import { Hero } from "@/components/home/Hero";
import { AboutBlock } from "@/components/home/AboutBlock";
import { AudienceCards } from "@/components/home/AudienceCards";
import { Steps } from "@/components/home/Steps";
import { BlogTeasers } from "@/components/home/BlogTeasers";
import { MediaStrip } from "@/components/home/MediaStrip";
import { Testimonials } from "@/components/home/Testimonials";

// Revalidate hourly: the ad-landing page must be fast (PageSpeed mobile).
// Latest blog teasers refresh on the next request after 1h. DB-failure
// fallback below still renders the page without teasers.
export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  let latest: Awaited<ReturnType<typeof getLatestPosts>> = [];
  try {
    latest = await getLatestPosts(locale, 3);
  } catch (err) {
    console.error("[home] failed to load latest posts:", err);
  }

  let endorsements: Awaited<ReturnType<typeof getEndorsements>> = [];
  try {
    endorsements = await getEndorsements(locale);
  } catch (err) {
    console.error("[home] failed to load endorsements:", err);
  }

  return (
    <>
      <PromoRibbon />
      <Hero />
      <AboutBlock />
      <AudienceCards />
      <Steps />
      <BlogTeasers posts={latest} />
      <MediaStrip />
      <Testimonials items={endorsements} />
    </>
  );
}
