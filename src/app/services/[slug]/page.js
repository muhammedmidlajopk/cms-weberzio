import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ServiceDetail from "@/components/ServiceDetail";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-data";
import { SERVICES, getServiceBySlug } from "@/lib/services-data";

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const s = await getSiteSettings();
  if (!service) return { title: `Service not found — ${s.siteName}` };
  return {
    title: `${service.title} — ${s.siteName}`,
    description: service.description,
    keywords: service.tags?.join(", "),
  };
}

export default async function ServiceSlugPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const settings = await getSiteSettings();

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Services"
          title={service.title}
          titleAlt=""
          description={service.tagline}
        />
        <ServiceDetail service={service} />
        <Process />
      </main>
      <Footer siteName={settings.siteName} />
    </>
  );
}
