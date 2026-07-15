import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import Footer from "@/components/Footer";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getSiteSettings } from "@/lib/site-data";

async function getCaseStudy(slug) {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug }).lean();
    if (!doc) return null;
    return JSON.parse(JSON.stringify(doc));
  } catch (err) {
    console.error("getCaseStudy error:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  const s = await getSiteSettings();
  if (!item) return { title: `Case study not found — ${s.siteName}` };
  return {
    title: `${item.title} — ${s.siteName}`,
    description: item.summary || item.meta || undefined,
    keywords: Array.isArray(item.tags) ? item.tags.join(", ") : undefined,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  if (!item) notFound();

  const settings = await getSiteSettings();

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Case Study"
          title={item.title}
          titleAlt=""
          description={item.meta}
        />
        <CaseStudyDetail item={item} />
      </main>
      <Footer siteName={settings.siteName} />
    </>
  );
}
