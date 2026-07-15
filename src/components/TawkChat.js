"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function TawkChat() {
  const pathname = usePathname();
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  if (!propertyId || !widgetId) return null;
  if (pathname?.startsWith("/control")) return null;

  return (
    <Script
      id="tawk-to"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
      crossOrigin="*"
    />
  );
}
