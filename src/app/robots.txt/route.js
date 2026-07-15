import { connectDB } from "@/lib/db";
import SeoFiles from "@/models/SeoFiles";
import { DEFAULT_ROBOTS, fillTemplate } from "@/lib/seo-defaults";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await SeoFiles.findOne({ key: "singleton" });
    let body = doc?.robots;

    if (!body) {
      const h = await headers();
      const proto = h.get("x-forwarded-proto") || "http";
      const host = h.get("x-forwarded-host") || h.get("host") || "";
      body = fillTemplate(DEFAULT_ROBOTS, { origin: `${proto}://${host}` });
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return new Response("User-agent: *\nAllow: /\n", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
