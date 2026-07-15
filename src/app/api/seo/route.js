import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import SiteSettings from "@/models/SiteSettings";

const DEFAULT_PAGES = ["home", "products", "services", "portfolio"];

export async function GET() {
  try {
    await connectDB();
    let doc = await SiteSettings.findOne({ key: "singleton" });
    if (!doc) doc = await SiteSettings.create({ key: "singleton" });

    const pages = {};
    for (const slug of DEFAULT_PAGES) {
      const entry = doc.pages?.get?.(slug) || doc.pages?.[slug] || {};
      pages[slug] = {
        title: entry.title || "",
        description: entry.description || "",
        keywords: entry.keywords || "",
        ogImage: entry.ogImage || "",
      };
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("GET /api/seo error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json();
    if (!body.pages || typeof body.pages !== "object") {
      return NextResponse.json({ error: "pages object required" }, { status: 400 });
    }

    const update = {};
    for (const [slug, meta] of Object.entries(body.pages)) {
      update[`pages.${slug}`] = {
        title: meta.title || "",
        description: meta.description || "",
        keywords: meta.keywords || "",
        ogImage: meta.ogImage || "",
      };
    }

    await SiteSettings.findOneAndUpdate(
      { key: "singleton" },
      { $set: update },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/seo error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
