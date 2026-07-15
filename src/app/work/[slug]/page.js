import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import CaseStudyDetail from "@/components/CaseStudyDetail";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
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
  const title = `${item.title} — ${s.siteName}`;
  const description = item.summary || item.meta || undefined;
  const image = item.coverImage || item.image || undefined;
  return {
    title,
    description,
    keywords: Array.isArray(item.tags) ? item.tags.join(", ") : undefined,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${slug}`,
      type: "article",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);
  if (!item) notFound();

  const settings = await getSiteSettings();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Work", item: "/#work" },
      { "@type": "ListItem", position: 3, name: item.title, item: `/work/${slug}` },
    ],
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    ...(item.summary && { description: item.summary }),
    ...(item.coverImage && { image: item.coverImage }),
    author: { "@type": "Organization", name: settings.siteName },
    publisher: { "@type": "Organization", name: settings.siteName },
    ...(item.tags && { keywords: item.tags.join(", ") }),
  };

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
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={articleLd} />
    </>
  );
}
