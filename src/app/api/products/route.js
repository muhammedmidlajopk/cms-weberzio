import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Product from "@/models/Product";

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base, excludeId = null) {
  let slug = base || "case-study";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Product.findOne(query).select("_id").lean();
    if (!existing) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      meta,
      price,
      imageUrl,
      tags,
      year,
      slug,
      summary,
      client,
      role,
      liveUrl,
      gallery,
      results,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const free = price?.toUpperCase() === "FREE";
    const baseSlug = slugify(slug || title);
    const finalSlug = await uniqueSlug(baseSlug);

    const product = await Product.create({
      title,
      slug: finalSlug,
      meta,
      price,
      free,
      imageUrl: imageUrl || "",
      tags: Array.isArray(tags) ? tags : [],
      year: year || "",
      summary: summary || "",
      client: client || "",
      role: role || "",
      liveUrl: liveUrl || "",
      gallery: Array.isArray(gallery) ? gallery : [],
      results: Array.isArray(results) ? results : [],
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
