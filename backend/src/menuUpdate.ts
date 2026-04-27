/**
 * Menu update script — replaces ALL categories and products with the
 * real Cake Gallery menu from the owner's menu card and food list.
 * Users, orders, order-items, coupons and reviews are NOT touched.
 */
import { prisma } from "./lib/prisma.js";

// ─── Images ──────────────────────────────────────────────────────────────────
const img = {
  cupcakes:      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1200&q=80",
  cake:          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80",
  redvelvet:     "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1200&q=80",
  lemonrocks:    "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80",
  pasta:         "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  creamypasta:   "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80",
  fries:         "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80",
  burger:        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  beefstew:      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  steamedrice:   "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=1200&q=80",
  vegrice:       "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  jollof:        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
  chineserice:   "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
  stirfry:       "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
  chickenmayo:   "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?auto=format&fit=crop&w=1200&q=80",
};

// ─── Wipe products & categories (keeps users, orders, order-items) ──────────
await prisma.review.deleteMany();       // FK: Review.productId → Product
await prisma.userFavorite.deleteMany(); // FK: UserFavorite.productId → Product
await prisma.product.deleteMany();
await prisma.category.deleteMany();

// ─── Categories (sequential to keep Neon connection alive) ───────────────────
await prisma.$connect();

const catCakes = await prisma.category.create({
  data: { name: "Cakes", slug: "cakes", description: "Custom celebration cakes and cupcakes baked fresh to order.", image: img.cake }
});
const catPastries = await prisma.category.create({
  data: { name: "Pastries", slug: "muffins-pastries", description: "Lemon rocks, pastries and sweet baked treats.", image: img.lemonrocks }
});
const catFood = await prisma.category.create({
  data: { name: "Cooked Food", slug: "cooked-food", description: "Hot meals, rice dishes, pasta, burgers and more.", image: img.jollof }
});

// ─── Products ────────────────────────────────────────────────────────────────
const products = [

  // ── Cakes ──
  {
    name: "Cupcakes (Box of 6)",
    slug: "cupcakes-box-6",
    description: "Six freshly baked cupcakes with buttercream swirls. Available in vanilla, chocolate and red velvet.",
    categoryId: catCakes.id,
    price: 180,
    image: img.cupcakes,
    isFeatured: true,
    prepTimeMinutes: 60,
    tags: ["cupcakes", "vanilla", "chocolate", "red velvet"]
  },
  {
    name: "Cupcakes (Box of 12)",
    slug: "cupcakes-box-12",
    description: "A dozen cupcakes with buttercream swirls — perfect for parties and celebrations. Vanilla, chocolate or red velvet.",
    categoryId: catCakes.id,
    price: 300,
    image: img.cupcakes,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 90,
    tags: ["cupcakes", "party", "vanilla", "chocolate", "red velvet"]
  },
  {
    name: "Cupcakes (Box of 24)",
    slug: "cupcakes-box-24",
    description: "Two dozen cupcakes — ideal for events, weddings and large gatherings. Vanilla, chocolate or red velvet.",
    categoryId: catCakes.id,
    price: 600,
    image: img.cupcakes,
    prepTimeMinutes: 120,
    tags: ["cupcakes", "event", "wedding"]
  },
  {
    name: "6\" Celebration Cake",
    slug: "cake-6-inch",
    description: "A gorgeous 6-inch custom cake in your choice of flavour — vanilla, chocolate or red velvet. Serves 8–10.",
    categoryId: catCakes.id,
    price: 900,
    image: img.cake,
    isFeatured: true,
    prepTimeMinutes: 240,
    tags: ["cake", "birthday", "custom", "vanilla", "chocolate", "red velvet"]
  },
  {
    name: "8\" Celebration Cake",
    slug: "cake-8-inch",
    description: "An elegant 8-inch custom cake in vanilla, chocolate or red velvet. Serves 14–18.",
    categoryId: catCakes.id,
    price: 1300,
    image: img.cake,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 300,
    tags: ["cake", "birthday", "custom", "vanilla", "chocolate", "red velvet"]
  },
  {
    name: "10\" Celebration Cake",
    slug: "cake-10-inch",
    description: "A stunning 10-inch show-stopping cake in vanilla, chocolate or red velvet. Serves 20–30.",
    categoryId: catCakes.id,
    price: 1600,
    image: img.redvelvet,
    prepTimeMinutes: 360,
    tags: ["cake", "wedding", "event", "custom"]
  },

  // ── Pastries ──
  {
    name: "Lemon Rocks (Box of 6)",
    slug: "lemon-rocks-box-6",
    description: "Six zesty lemon rock cakes — soft and crumbly with a bright citrus flavour.",
    categoryId: catPastries.id,
    price: 90,
    image: img.lemonrocks,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 45,
    tags: ["lemon", "pastry", "snack"]
  },
  {
    name: "Lemon Rocks (Box of 12)",
    slug: "lemon-rocks-box-12",
    description: "A dozen zesty lemon rock cakes, perfect for sharing.",
    categoryId: catPastries.id,
    price: 180,
    image: img.lemonrocks,
    isFeatured: true,
    prepTimeMinutes: 60,
    tags: ["lemon", "pastry", "party"]
  },
  {
    name: "Lemon Rocks (Box of 24)",
    slug: "lemon-rocks-box-24",
    description: "Two dozen lemon rock cakes — great for events and offices.",
    categoryId: catPastries.id,
    price: 240,
    image: img.lemonrocks,
    prepTimeMinutes: 90,
    tags: ["lemon", "pastry", "event"]
  },

  // ── Cooked Food ──
  {
    name: "Stir Fried Pasta",
    slug: "stir-fried-pasta",
    description: "Wok-tossed pasta with vegetables and a savoury stir-fry sauce.",
    categoryId: catFood.id,
    price: 200,
    image: img.pasta,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["pasta", "lunch", "dinner"]
  },
  {
    name: "Creamy Pasta",
    slug: "creamy-pasta",
    description: "Rich and velvety pasta in a creamy sauce, garnished with herbs.",
    categoryId: catFood.id,
    price: 280,
    image: img.creamypasta,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 25,
    tags: ["pasta", "creamy", "lunch", "dinner"]
  },
  {
    name: "Loaded Fries",
    slug: "loaded-fries",
    description: "Crispy golden fries loaded with toppings. A crowd-pleasing snack.",
    categoryId: catFood.id,
    price: 120,
    image: img.fries,
    isTodaySpecial: true,
    prepTimeMinutes: 20,
    tags: ["fries", "snack", "lunch"]
  },
  {
    name: "Burger and Fries",
    slug: "burger-and-fries",
    description: "Juicy beef burger in a toasted bun served with crispy fries.",
    categoryId: catFood.id,
    price: 180,
    image: img.burger,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["burger", "fries", "lunch", "dinner"]
  },
  {
    name: "Beef Stew with Rice",
    slug: "beef-stew-rice",
    description: "Tender beef stew served with your choice of steamed or vegetable fried rice.",
    categoryId: catFood.id,
    price: 220,
    image: img.beefstew,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 30,
    tags: ["beef", "stew", "rice", "lunch", "dinner"]
  },
  {
    name: "Steamed Rice with Chicken",
    slug: "steamed-rice-chicken",
    description: "Steamed rice with two pieces of chicken and a fresh coleslaw.",
    categoryId: catFood.id,
    price: 150,
    image: img.steamedrice,
    prepTimeMinutes: 25,
    tags: ["rice", "chicken", "lunch"]
  },
  {
    name: "Vegetable Fried Rice with Chicken",
    slug: "veg-fried-rice-chicken",
    description: "Vegetable fried rice with two pieces of chicken and 2 samoosas.",
    categoryId: catFood.id,
    price: 150,
    image: img.vegrice,
    prepTimeMinutes: 25,
    tags: ["rice", "chicken", "vegetable", "lunch"]
  },
  {
    name: "Jollof Rice with Chicken",
    slug: "jollof-rice-chicken",
    description: "West-African style jollof rice with 2 pieces of chicken, coleslaw and 2 samosas.",
    categoryId: catFood.id,
    price: 150,
    image: img.jollof,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 30,
    tags: ["jollof", "rice", "chicken", "lunch", "dinner"]
  },
  {
    name: "Chinese Fried Rice with Chicken",
    slug: "chinese-fried-rice-chicken",
    description: "Chinese-style fried rice with 2 pieces of chicken and coleslaw.",
    categoryId: catFood.id,
    price: 200,
    image: img.chineserice,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["chinese", "rice", "chicken", "lunch", "dinner"]
  },
  {
    name: "Chicken Stir Fry Rice",
    slug: "chicken-stir-fry-rice",
    description: "Stir-fried rice with tender chicken strips and vegetables.",
    categoryId: catFood.id,
    price: 150,
    image: img.stirfry,
    prepTimeMinutes: 25,
    tags: ["rice", "chicken", "stir fry", "lunch"]
  },
  {
    name: "Beef Stir Fry Rice",
    slug: "beef-stir-fry-rice",
    description: "Stir-fried rice with seasoned beef strips and fresh vegetables.",
    categoryId: catFood.id,
    price: 150,
    image: img.stirfry,
    prepTimeMinutes: 25,
    tags: ["rice", "beef", "stir fry", "lunch"]
  },
  {
    name: "Chicken Mayo",
    slug: "chicken-mayo",
    description: "Creamy chicken mayo — served on its own or as a side. Light and satisfying.",
    categoryId: catFood.id,
    price: 90,
    image: img.chickenmayo,
    isTodaySpecial: true,
    prepTimeMinutes: 15,
    tags: ["chicken", "mayo", "snack", "lunch"]
  }
];

await prisma.product.createMany({
  data: products.map((p) => ({ ...p, isAvailable: true, stock: 50, images: [] }))
});

console.log(`✅  Menu updated — ${products.length} products across 3 categories.`);
process.exit(0);
