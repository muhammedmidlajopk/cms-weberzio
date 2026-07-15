import mongoose from "mongoose";

const SeoFilesSchema = new mongoose.Schema(
  {
    key: { type: String, default: "singleton", unique: true },
    robots: { type: String, default: "" },
    llms: { type: String, default: "" },
    sitemap: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.SeoFiles ||
  mongoose.model("SeoFiles", SeoFilesSchema);
