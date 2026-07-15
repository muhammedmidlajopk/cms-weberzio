import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/site-data";
import { SERVICES } from "@/lib/services-data";

export async function generateMetadata() {
  const s = await getSiteSettings();
  const page = s.pages?.services || {};
  const title = page.title || `Services — ${s.siteName}`;
  const description =
    page.description ||
    "Web development, SaaS engineering, APIs, cloud infrastructure, and technical consulting for startups and enterprise teams.";
  return {
    title,
    description,
    keywords: page.keywords || "web development, SaaS, Next.js, React, Node.js, cloud infrastructure, API",
    alternates: { canonical: "/services" },
    openGraph: {
      title,
      description,
      url: "/services",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "/services" },
    ],
  };

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Services offered by ${settings.siteName}`,
    itemListElement: SERVICES.map((svc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: svc.title,
      description: svc.description,
      url: `/services/${svc.slug}`,
    })),
  };

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Services"
          eyebrowIndex="01"
          title="Services"
          titleAlt="we offer."
          description="Web applications, SaaS platforms, APIs, cloud infrastructure, and the technical guidance to keep it all moving forward."
        />
        <ServicesGrid tagIndex="02" />
        <Process tagIndex="03" />
      </main>
      <Footer siteName={settings.siteName} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={servicesLd} />
    </>
  );
}
