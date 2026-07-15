import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    data: { type: String, default: "" },
    mime: { type: String, default: "" },
    updatedAt: { type: Date },
  },
  { _id: false }
);

const PageMetaSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: String, default: "" },
    ogImage: { type: String, default: "" },
  },
  { _id: false }
);

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "singleton", unique: true },

    siteName: { type: String, default: "weberzio" },
    tagline: { type: String, default: "UX/UI Designer" },
    homeTitle: { type: String, default: "weberzio" },
    homeDescription: { type: String, default: "weberzio - UX/UI Designer" },
    keywords: { type: String, default: "" },
    ogImageUrl: { type: String, default: "" },

    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },

    logo: { type: AssetSchema, default: () => ({}) },
    favicon: { type: AssetSchema, default: () => ({}) },

    twitterHandle: { type: String, default: "" },
    themeColor: { type: String, default: "#04050f" },

    pages: {
      type: Map,
      of: PageMetaSchema,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", SiteSettingsSchema);
