import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Testimonial from "@/models/Testimonial";

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { name, role, company, quote, avatarUrl, rating, order } = body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { name, role, company, quote, avatarUrl, rating, order },
      { new: true }
    );

    if (!testimonial) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error("PUT /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
