import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Testimonials from "@/components/Testimonials";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-data";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <Hero siteName={settings.siteName} tagline={settings.tagline} />
        <Work />
        <Testimonials />
        <About />
      </main>
      <Footer siteName={settings.siteName} />
    </>
  );
}
