import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Service from "@/models/Service";

export async function PUT(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    const { title, description, tags } = body;

    const service = await Service.findByIdAndUpdate(
      id,
      { title, description, tags: tags || [] },
      { new: true }
    );

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("PUT /api/services/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    const { id } = await params;
    await connectDB();

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/services/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
