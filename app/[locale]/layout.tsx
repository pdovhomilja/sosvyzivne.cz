import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, Open_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaBand } from "@/components/layout/CtaBand";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
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
      className={`${playfair.variable} ${openSans.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <CtaBand />
          <Footer />
        </NextIntlClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
