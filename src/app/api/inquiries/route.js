import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import Inquiry from "@/models/Inquiry";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, company, budget, message } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: (company || "").trim(),
      budget: (budget || "").trim(),
      message: message.trim(),
    });

    return NextResponse.json({ success: true, id: inquiry._id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(200);
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
