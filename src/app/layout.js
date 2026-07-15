import { Sora } from "next/font/google";
import { headers } from "next/headers";
import CursorDot from "@/components/CursorDot";
import TawkChat from "@/components/TawkChat";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/site-data";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateViewport() {
  const s = await getSiteSettings();
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: s.themeColor,
  };
}

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

async function getOrigin() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

export async function generateMetadata() {
  const s = await getSiteSettings();
  const homePage = s.pages?.home || {};

  const title = homePage.title || s.homeTitle || s.siteName;
  const description =
    homePage.description ||
    s.homeDescription ||
    `${s.siteName} builds reliable web applications, SaaS platforms, APIs, and cloud infrastructure for startups and enterprises.`;
  const keywords = homePage.keywords || s.keywords;
  const ogImage = homePage.ogImage || s.ogImageUrl;

  const origin = await getOrigin();
  const h = await headers();
  const pathname = h.get("x-invoke-path") || h.get("x-pathname") || "/";
  const canonical = `${origin}${pathname}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: title,
      template: `%s — ${s.siteName}`,
    },
    description,
    keywords: keywords || undefined,
    applicationName: s.siteName,
    authors: [{ name: s.siteName }],
    creator: s.siteName,
    publisher: s.siteName,
    icons: s.faviconUrl ? { icon: s.faviconUrl } : undefined,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: s.siteName,
      images: ogImage ? [ogImage] : undefined,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: s.twitterHandle ? `@${s.twitterHandle}` : undefined,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default async function RootLayout({ children }) {
  const s = await getSiteSettings();
  const origin = await getOrigin();

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.siteName,
    url: origin,
    ...(s.logoUrl && { logo: `${origin}${s.logoUrl.startsWith("/") ? "" : "/"}${s.logoUrl}` }),
    description:
      s.homeDescription ||
      `${s.siteName} builds reliable web applications, SaaS platforms, APIs, and cloud infrastructure.`,
    ...(s.twitterHandle && {
      sameAs: [`https://twitter.com/${s.twitterHandle}`],
    }),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.siteName,
    url: origin,
    ...(s.homeDescription && { description: s.homeDescription }),
  };

  return (
    <html lang="en" className={`${sora.variable}`}>
      <body>
        <CursorDot />
        {children}
        <TawkChat />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
      </body>
    </html>
  );
}
