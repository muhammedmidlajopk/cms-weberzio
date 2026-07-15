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

async function uniqueSlug(base, excludeId) {
  let slug = base || "case-study";
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Product.findOne({
      slug,
      _id: { $ne: excludeId },
    })
      .select("_id")
      .lean();
    if (!existing) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
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

    const free = price?.toUpperCase() === "FREE";
    const baseSlug = slugify(slug || title);
    const finalSlug = await uniqueSlug(baseSlug, id);

    const product = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
