import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    meta: { type: String, default: "" },
    price: { type: String, default: "$0" },
    free: { type: Boolean, default: false },
    imageUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
    year: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
