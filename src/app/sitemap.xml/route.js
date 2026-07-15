import { connectDB } from "@/lib/db";
import SeoFiles from "@/models/SeoFiles";
import { buildSitemap } from "@/lib/seo-defaults";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await SeoFiles.findOne({ key: "singleton" });
    let body = doc?.sitemap;

    if (!body) {
      const h = await headers();
      const proto = h.get("x-forwarded-proto") || "http";
      const host = h.get("x-forwarded-host") || h.get("host") || "";
      body = buildSitemap(`${proto}://${host}`);
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response('<?xml version="1.0"?><urlset/>', {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
