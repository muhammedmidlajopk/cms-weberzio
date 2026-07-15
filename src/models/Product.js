import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, default: "", index: true },
    meta: { type: String, default: "" },
    price: { type: String, default: "$0" },
    free: { type: Boolean, default: false },
    imageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    year: { type: String, default: "" },
    summary: { type: String, default: "" },
    client: { type: String, default: "" },
    role: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    results: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
