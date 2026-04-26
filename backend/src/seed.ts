import { connectDb } from "./config/db.js";
import { Category } from "./models/Category.js";
import { Coupon } from "./models/Coupon.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";

const images = {
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  muffin: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80",
  pastry: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80",
  breakfast: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  lunch: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80",
  dinner: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80"
};

await connectDb();
await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany(), Coupon.deleteMany()]);

const admin = await User.create({
  name: "The Cake Gallery Admin",
  email: "waka.bk29@gmail.com",
  phone: "+260974063136",
  password: "Admin@12345",
  role: "admin",
  address: "Lusaka, Zambia"
});

const customer = await User.create({
  name: "Demo Customer",
  email: "customer@example.com",
  phone: "+260961234567",
  password: "Customer@123",
  address: "Kabulonga, Lusaka"
});

const categoryDocs = await Category.insertMany([
  { name: "Cakes", slug: "cakes", description: "Celebration cakes, birthday cakes and slices.", image: images.cake },
  { name: "Muffins & Pastries", slug: "muffins-pastries", description: "Fresh muffins, croissants, buns and pastries.", image: images.muffin },
  { name: "Cooked Food", slug: "cooked-food", description: "Breakfast, lunch, dinner, snacks and local cooked meals.", image: images.lunch },
  { name: "Drinks", slug: "drinks", description: "Fresh juices, chilled drinks and hot beverages.", image: images.drink }
]);

const categoryBySlug = new Map(categoryDocs.map((category) => [category.slug, category._id]));

await Product.insertMany([
  {
    name: "Luxury Chocolate Birthday Cake",
    slug: "luxury-chocolate-birthday-cake",
    description: "Moist chocolate sponge layered with silky buttercream and premium cocoa glaze.",
    category: categoryBySlug.get("cakes"),
    price: 650,
    image: images.cake,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 180,
    tags: ["birthday", "chocolate", "custom"]
  },
  {
    name: "Vanilla Cupcake Box",
    slug: "vanilla-cupcake-box",
    description: "A dozen soft vanilla cupcakes finished with buttercream swirls.",
    category: categoryBySlug.get("cakes"),
    price: 180,
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=1200&q=80",
    isFeatured: true,
    tags: ["cupcakes", "party"]
  },
  {
    name: "Blueberry Muffins",
    slug: "blueberry-muffins",
    description: "Fresh baked muffins packed with blueberries and a golden crumb top.",
    category: categoryBySlug.get("muffins-pastries"),
    price: 35,
    image: images.muffin,
    isTodaySpecial: true,
    tags: ["muffin", "breakfast"]
  },
  {
    name: "Butter Croissants",
    slug: "butter-croissants",
    description: "Flaky bakery croissants baked fresh every morning.",
    category: categoryBySlug.get("muffins-pastries"),
    price: 45,
    image: images.pastry,
    tags: ["pastry", "breakfast"]
  },
  {
    name: "English Breakfast Plate",
    slug: "english-breakfast-plate",
    description: "Eggs, sausage, toast, baked beans and grilled tomato.",
    category: categoryBySlug.get("cooked-food"),
    price: 95,
    image: images.breakfast,
    isFeatured: true,
    tags: ["breakfast", "eggs"]
  },
  {
    name: "Chicken Nshima Lunch",
    slug: "chicken-nshima-lunch",
    description: "Tender chicken stew served with nshima and seasonal vegetables.",
    category: categoryBySlug.get("cooked-food"),
    price: 120,
    image: images.lunch,
    isFeatured: true,
    tags: ["nshima", "lunch", "zambian"]
  },
  {
    name: "Grilled Dinner Platter",
    slug: "grilled-dinner-platter",
    description: "Grilled meat, rice, chips, salad and house sauce.",
    category: categoryBySlug.get("cooked-food"),
    price: 165,
    image: images.dinner,
    tags: ["dinner", "grill"]
  },
  {
    name: "Fresh Passion Juice",
    slug: "fresh-passion-juice",
    description: "Cold pressed passion fruit juice, lightly sweetened.",
    category: categoryBySlug.get("drinks"),
    price: 30,
    image: images.drink,
    tags: ["drink", "juice"]
  }
]);

await Coupon.create({
  code: "WELCOME10",
  discountType: "percentage",
  value: 10,
  minOrderAmount: 150,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
});

console.log("Seed complete", { admin: admin.email, customer: customer.email });
process.exit(0);

