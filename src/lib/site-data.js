import { connectDB } from "./db";
import SiteSettings from "@/models/SiteSettings";
import NavMenu from "@/models/NavMenu";

export async function getSiteSettings() {
  try {
    await connectDB();
    let doc = await SiteSettings.findOne({ key: "singleton" }).lean();
    if (!doc) doc = {};

    const logoUrl = doc.logoUrl || (doc.logo?.data ? "/api/settings/asset/logo" : "");
    const faviconUrl = doc.faviconUrl || (doc.favicon?.data ? "/api/settings/asset/favicon" : "");

    return {
      siteName: doc.siteName || "weberzio",
      tagline: doc.tagline || "UX/UI Designer",
      homeTitle: doc.homeTitle || "weberzio",
      homeDescription: doc.homeDescription || "weberzio - UX/UI Designer",
      keywords: doc.keywords || "",
      ogImageUrl: doc.ogImageUrl || "",
      twitterHandle: doc.twitterHandle || "",
      themeColor: doc.themeColor || "#04050f",
      logoUrl,
      faviconUrl,
      pages: doc.pages || {},
    };
  } catch (e) {
    console.error("getSiteSettings error:", e);
    return {
      siteName: "weberzio",
      tagline: "UX/UI Designer",
      homeTitle: "weberzio",
      homeDescription: "weberzio - UX/UI Designer",
      keywords: "",
      ogImageUrl: "",
      twitterHandle: "",
      themeColor: "#04050f",
      logoUrl: "",
      faviconUrl: "",
      pages: {},
    };
  }
}

export async function getMenu(location) {
  try {
    await connectDB();
    const doc = await NavMenu.findOne({ location }).lean();
    if (!doc) return null;
    return doc.items
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((i) => ({ label: i.label, href: i.href }));
  } catch (e) {
    console.error("getMenu error:", e);
    return null;
  }
}
