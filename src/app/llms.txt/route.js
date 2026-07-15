import { connectDB } from "@/lib/db";
import SeoFiles from "@/models/SeoFiles";
import SiteSettings from "@/models/SiteSettings";
import { DEFAULT_LLMS, fillTemplate } from "@/lib/seo-defaults";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await SeoFiles.findOne({ key: "singleton" });
    let body = doc?.llms;

    if (!body) {
      const h = await headers();
      const proto = h.get("x-forwarded-proto") || "http";
      const host = h.get("x-forwarded-host") || h.get("host") || "";
      const settings = await SiteSettings.findOne({ key: "singleton" });
      body = fillTemplate(DEFAULT_LLMS, {
        origin: `${proto}://${host}`,
        siteName: settings?.siteName || "Site",
        tagline: settings?.tagline || "",
        homeDescription: settings?.homeDescription || "",
      });
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("", { status: 200 });
  }
}
