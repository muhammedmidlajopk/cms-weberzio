import { Sora } from "next/font/google";
import { headers } from "next/headers";
import CursorDot from "@/components/CursorDot";
import TawkChat from "@/components/TawkChat";
import { getSiteSettings } from "@/lib/site-data";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata() {
  const s = await getSiteSettings();
  const homePage = s.pages?.home || {};

  const title = homePage.title || s.homeTitle || s.siteName;
  const description = homePage.description || s.homeDescription;
  const keywords = homePage.keywords || s.keywords;
  const ogImage = homePage.ogImage || s.ogImageUrl;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
  const origin = `${proto}://${host}`;
  const pathname = h.get("x-invoke-path") || h.get("x-pathname") || "/";
  const canonical = `${origin}${pathname}`;

  return {
    metadataBase: new URL(origin),
    title,
    description,
    keywords: keywords || undefined,
    icons: s.faviconUrl ? { icon: s.faviconUrl } : undefined,
    themeColor: s.themeColor,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: s.siteName,
      images: ogImage ? [ogImage] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: s.twitterHandle ? `@${s.twitterHandle}` : undefined,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable}`}>
      <body>
        <CursorDot />
        {children}
        <TawkChat />
      </body>
    </html>
  );
}
