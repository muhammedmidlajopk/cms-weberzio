import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import SeoFiles from "@/models/SeoFiles";
import SiteSettings from "@/models/SiteSettings";
import {
  DEFAULT_ROBOTS,
  DEFAULT_LLMS,
  buildSitemap,
  fillTemplate,
} from "@/lib/seo-defaults";

function getOrigin(request) {
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  return `${proto}://${host}`;
}

async function ensureDoc(request) {
  let doc = await SeoFiles.findOne({ key: "singleton" });
  if (!doc) {
    const origin = getOrigin(request);
    const settings = await SiteSettings.findOne({ key: "singleton" });
    const vars = {
      origin,
      siteName: settings?.siteName || "Site",
      tagline: settings?.tagline || "",
      homeDescription: settings?.homeDescription || "",
    };
    doc = await SeoFiles.create({
      key: "singleton",
      robots: fillTemplate(DEFAULT_ROBOTS, vars),
      llms: fillTemplate(DEFAULT_LLMS, vars),
      sitemap: buildSitemap(origin),
    });
  }
  return doc;
}

export async function GET(request) {
  try {
    await connectDB();
    const doc = await ensureDoc(request);
    return NextResponse.json({
      files: {
        robots: doc.robots,
        llms: doc.llms,
        sitemap: doc.sitemap,
      },
    });
  } catch (error) {
    console.error("GET /api/seo-files error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json();
    const update = {};
    for (const key of ["robots", "llms", "sitemap"]) {
      if (typeof body[key] === "string") update[key] = body[key];
    }

    const doc = await SeoFiles.findOneAndUpdate(
      { key: "singleton" },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      files: {
        robots: doc.robots,
        llms: doc.llms,
        sitemap: doc.sitemap,
      },
    });
  } catch (error) {
    console.error("PUT /api/seo-files error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json().catch(() => ({}));
    const action = body.action;

    if (action !== "regenerate-sitemap") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const origin = getOrigin(request);
    const sitemap = buildSitemap(origin, ["/"]);
    const doc = await SeoFiles.findOneAndUpdate(
      { key: "singleton" },
      { $set: { sitemap } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ files: { sitemap: doc.sitemap } });
  } catch (error) {
    console.error("POST /api/seo-files error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
