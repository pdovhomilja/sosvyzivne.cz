import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SERVICES, getService } from "@/lib/content/services";
import { ServiceArticle } from "@/components/site/ServiceArticle";
import { MediationPage } from "@/components/site/MediationPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  return s ? { title: `${s.title} – SOS výživné`, description: s.lead } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getService(slug);
  if (!service) notFound();
  // Mediace has its own long-form page with pricing and a form to the mediator (Lenka, 30. 9. 2026).
  if (slug === "mediace") return <MediationPage />;
  return <ServiceArticle service={service} />;
}
