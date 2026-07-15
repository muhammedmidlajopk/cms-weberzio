import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    await connectDB();
    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error("GET /api/products/slug/[slug] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
