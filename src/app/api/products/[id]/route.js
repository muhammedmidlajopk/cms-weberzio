import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Product from "@/models/Product";

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { title, meta, price, imageUrl, tags, year } = body;

    const free = price?.toUpperCase() === "FREE";

    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        meta,
        price,
        free,
        imageUrl: imageUrl || "",
        tags: Array.isArray(tags) ? tags : [],
        year: year || "",
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
