import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import SiteSettings from "@/models/SiteSettings";

async function getOrCreate() {
  let doc = await SiteSettings.findOne({ key: "singleton" });
  if (!doc) doc = await SiteSettings.create({ key: "singleton" });
  return doc;
}

function toPublic(doc) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.logo;
  delete obj.favicon;
  return obj;
}

export async function GET() {
  try {
    await connectDB();
    const doc = await getOrCreate();
    return NextResponse.json({ settings: toPublic(doc) });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json();

    const allowed = [
      "siteName",
      "tagline",
      "homeTitle",
      "homeDescription",
      "keywords",
      "ogImageUrl",
      "logoUrl",
      "faviconUrl",
      "twitterHandle",
      "themeColor",
    ];

    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }

    const doc = await SiteSettings.findOneAndUpdate(
      { key: "singleton" },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ settings: toPublic(doc) });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
