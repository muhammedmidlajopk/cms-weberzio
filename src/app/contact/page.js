import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/site-data";

export async function generateMetadata() {
  const s = await getSiteSettings();
  const page = s.pages?.contact || {};
  return {
    title: page.title || `Contact — ${s.siteName}`,
    description:
      page.description ||
      "Start a project with our team. Web development, SaaS engineering, and technical consulting inquiries welcome.",
    keywords: page.keywords || undefined,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Let's talk"
          titleAlt="about your project."
          description="Tell us what you're building and we'll get back to you within one business day with next steps."
        />
        <ContactForm />
      </main>
      <Footer siteName={settings.siteName} />
    </>
  );
}
