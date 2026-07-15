import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/api-auth";
import NavMenu from "@/models/NavMenu";

const LOCATIONS = ["header", "footer"];

const DEFAULTS = {
  header: [
    { label: "Home", href: "/", order: 0 },
    { label: "Services", href: "/services", order: 1 },
    { label: "Work", href: "/#work", order: 2 },
    { label: "Contact", href: "/contact", order: 3 },
  ],
  footer: [
    { label: "Home", href: "/", order: 0 },
    { label: "Services", href: "/services", order: 1 },
    { label: "Contact", href: "/contact", order: 2 },
  ],
};

export async function GET() {
  try {
    await connectDB();
    const menus = {};
    for (const location of LOCATIONS) {
      let doc = await NavMenu.findOne({ location });
      if (!doc) {
        doc = await NavMenu.create({ location, items: DEFAULTS[location] });
      }
      menus[location] = doc.items
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((i) => ({ id: i._id.toString(), label: i.label, href: i.href, order: i.order }));
    }
    return NextResponse.json({ menus });
  } catch (error) {
    console.error("GET /api/menus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request);
  if (auth.status === 401) return auth;

  try {
    await connectDB();
    const body = await request.json();
    if (!body.menus || typeof body.menus !== "object") {
      return NextResponse.json({ error: "menus object required" }, { status: 400 });
    }

    for (const location of LOCATIONS) {
      const incoming = body.menus[location];
      if (!Array.isArray(incoming)) continue;
      const items = incoming
        .filter((i) => i && i.label && i.href)
        .map((i, idx) => ({ label: i.label, href: i.href, order: idx }));

      await NavMenu.findOneAndUpdate(
        { location },
        { $set: { items } },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/menus error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
