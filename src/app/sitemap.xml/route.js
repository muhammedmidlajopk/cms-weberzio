import { connectDB } from "@/lib/db";
import SeoFiles from "@/models/SeoFiles";
import Product from "@/models/Product";
import { buildSitemap } from "@/lib/seo-defaults";
import { SERVICES } from "@/lib/services-data";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getProductSlugs() {
  try {
    const docs = await Product.find({}, { slug: 1, updatedAt: 1 }).lean();
    return docs.filter((d) => d.slug).map((d) => ({
      path: `/work/${d.slug}`,
      lastmod: d.updatedAt ? new Date(d.updatedAt).toISOString() : undefined,
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const origin = `${proto}://${host}`;

  try {
    await connectDB();
    const doc = await SeoFiles.findOne({ key: "singleton" });
    if (doc?.sitemap) {
      return new Response(doc.sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    const staticRoutes = [
      { path: "/", changefreq: "weekly", priority: "1.0" },
      { path: "/services", changefreq: "monthly", priority: "0.9" },
      { path: "/contact", changefreq: "yearly", priority: "0.7" },
    ];

    const serviceRoutes = SERVICES.map((s) => ({
      path: `/services/${s.slug}`,
      changefreq: "monthly",
      priority: "0.8",
    }));

    const productRoutes = await getProductSlugs();

    const body = buildSitemap(origin, [
      ...staticRoutes,
      ...serviceRoutes,
      ...productRoutes.map((p) => ({ ...p, changefreq: "monthly", priority: "0.7" })),
    ]);

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    const body = buildSitemap(origin, [{ path: "/" }]);
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
