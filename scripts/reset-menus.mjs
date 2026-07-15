import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI missing in .env");
  process.exit(1);
}

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

const NavMenu =
  mongoose.models.NavMenu || mongoose.model("NavMenu", NavMenuSchema);

const MENUS = {
  header: [
    { label: "Home", href: "/", order: 0 },
    { label: "Services", href: "/services", order: 1 },
    { label: "Work", href: "/#work", order: 2 },
    { label: "Contact", href: "/contact", order: 3 },
  ],
  footer: [
    { label: "Home", href: "/", order: 0 },
    { label: "Services", href: "/services", order: 1 },
    { label: "Contact", href: "/contact", order: 2 },
  ],
};

await mongoose.connect(MONGODB_URI);

for (const [location, items] of Object.entries(MENUS)) {
  await NavMenu.findOneAndUpdate(
    { location },
    { $set: { items } },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log(`Reset ${location}:`, items.map((i) => `${i.label} -> ${i.href}`).join(", "));
}

await mongoose.disconnect();
console.log("Done.");
