import Header from "@/components/Header";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/site-data";

export async function generateMetadata() {
  const s = await getSiteSettings();
  const page = s.pages?.contact || {};
  const title = page.title || `Contact — ${s.siteName}`;
  const description =
    page.description ||
    `Start a project with ${s.siteName}. Web development, SaaS engineering, and technical consulting inquiries — we reply within one business day.`;
  return {
    title,
    description,
    keywords: page.keywords || "contact, hire developer, project inquiry, web development",
    alternates: { canonical: "/contact" },
    openGraph: {
      title,
      description,
      url: "/contact",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Contact", item: "/contact" },
    ],
  };

  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact ${settings.siteName}`,
    url: "/contact",
  };

  return (
    <>
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <main>
        <PageHero
          eyebrow="Contact"
          eyebrowIndex="01"
          title="Let's talk"
          titleAlt="about your project."
          description="Tell us what you're building and we'll get back to you within one business day with next steps."
        />
        <ContactForm tagIndex="02" />
      </main>
      <Footer siteName={settings.siteName} />
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={contactLd} />
    </>
  );
}
