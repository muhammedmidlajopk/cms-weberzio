import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Product from "@/models/Product";

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
    const { title, meta, price, imageUrl, tags, year } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const free = price?.toUpperCase() === "FREE";

    const product = await Product.create({
      title,
      meta,
      price,
      free,
      imageUrl: imageUrl || "",
      tags: Array.isArray(tags) ? tags : [],
      year: year || "",
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
