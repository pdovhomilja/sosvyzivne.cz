import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/layout/CtaBand";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/CookieConsent";
import { PostHogAnalytics } from "@/components/PostHogAnalytics";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["italic", "normal"],
});

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sosvyzivne.cz"
).replace(/\/+$/, "");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const title = t("metaTitle");
  const description = t("metaDescription");
  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    ...socialMetadata({ title, description, locale, type: "website" }),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${hanken.variable} ${instrument.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CtaBand />
          <Footer />
          <CookieConsent />
        </NextIntlClientProvider>
        <Toaster richColors />
        <PostHogAnalytics />
      </body>
    </html>
  );
}
