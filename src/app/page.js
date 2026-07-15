import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import Work from "@/components/Work";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/site-data";
import { SERVICES } from "@/lib/services-data";

export default async function Home() {
  const settings = await getSiteSettings();

  const servicesLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Services offered by ${settings.siteName}`,
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      description: s.description,
      url: `/services/${s.slug}`,
    })),
  };

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <Hero siteName={settings.siteName} tagline={settings.tagline} />
        <About tagIndex="01" />
        <Highlights tagIndex="02" />
        <Work tagIndex="03" />
        <Testimonials tagIndex="04" />
        <FAQ tagIndex="05" />
      </main>
      <Footer siteName={settings.siteName} />
      <JsonLd data={servicesLd} />
    </>
  );
}
