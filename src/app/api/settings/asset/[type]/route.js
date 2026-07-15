import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function GET(request, { params }) {
  try {
    const { type } = await params;
    if (type !== "logo" && type !== "favicon") {
      return new Response("Not found", { status: 404 });
    }

    await connectDB();
    const doc = await SiteSettings.findOne({ key: "singleton" });
    const asset = doc?.[type];
    if (!asset?.data) {
      return new Response("Not found", { status: 404 });
    }

    const buffer = Buffer.from(asset.data, "base64");
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": asset.mime || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("GET /api/settings/asset error:", error);
    return new Response("Server error", { status: 500 });
  }
}
