import mongoose from "mongoose";

const NavItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const NavMenuSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, unique: true },
    items: [NavItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.NavMenu || mongoose.model("NavMenu", NavMenuSchema);
