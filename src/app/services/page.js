import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-data";

export async function generateMetadata() {
  const s = await getSiteSettings();
  const page = s.pages?.services || {};
  return {
    title: page.title || `Services — ${s.siteName}`,
    description:
      page.description ||
      "Web development, SaaS engineering, APIs, cloud infrastructure, and technical consulting.",
    keywords: page.keywords || undefined,
  };
}

export default async function ServicesPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Services"
          title="Services"
          titleAlt="we offer."
          description="Web applications, SaaS platforms, APIs, cloud infrastructure, and the technical guidance to keep it all moving forward."
        />
        <ServicesGrid />
        <Process />
      </main>
      <Footer siteName={settings.siteName} />
    </>
  );
}
