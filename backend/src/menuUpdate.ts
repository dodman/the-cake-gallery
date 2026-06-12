/**
 * Menu update script — replaces ALL categories and products with the
 * real Cake Gallery menu photographed by the owner.
 * Users, orders, order-items, coupons and reviews are NOT touched.
 */
import { prisma } from "./lib/prisma.js";

// ─── Images ──────────────────────────────────────────────────────────────────
const img = {
  // Cakes
  birthdaycake:    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  minibirthday:    "https://images.unsplash.com/photo-1629196255619-011da87ee3c3?auto=format&fit=crop&w=1200&q=80",
  twincakes:       "https://images.unsplash.com/photo-1582576692264-673047bedf5c?auto=format&fit=crop&w=1200&q=80",
  cupcakes:        "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1200&q=80",
  barbiecake:      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1200&q=80",
  cake:            "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80",
  chocolatecake:   "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
  redvelvet:       "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=1200&q=80",
  // Pastries
  muffins:         "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80",
  // Cooked Food
  grilledchicken:  "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?auto=format&fit=crop&w=1200&q=80",
  creamypasta:     "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80",
  beefstew:        "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  fries:           "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80",
  pasta:           "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  jollof:          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=1200&q=80",
  breakfast:       "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  friedrice:       "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
  stirfry:         "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
  platter:         "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  chickenstew:     "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1200&q=80",
};

// ─── Wipe products & categories (keeps users, orders, order-items) ──────────
await prisma.review.deleteMany();
await prisma.userFavorite.deleteMany();
await prisma.product.deleteMany();
await prisma.category.deleteMany();

// ─── Categories ──────────────────────────────────────────────────────────────
await prisma.$connect();

const catCakes = await prisma.category.create({
  data: { name: "Cakes", slug: "cakes", description: "Custom celebration cakes and cupcakes baked fresh to order.", image: img.cake }
});
const catPastries = await prisma.category.create({
  data: { name: "Pastries", slug: "pastries", description: "Freshly baked muffins and sweet baked treats.", image: img.muffins }
});
const catFood = await prisma.category.create({
  data: { name: "Cooked Food", slug: "cooked-food", description: "Hot meals, rice dishes, pasta, platters and more.", image: img.jollof }
});

// ─── Products ────────────────────────────────────────────────────────────────
const products = [

  // ── Cakes ──
  {
    name: "Mini Birthday Cake",
    slug: "mini-birthday-cake",
    description: "A beautiful white and gold mini birthday cake adorned with balloon decorations. Perfect for intimate celebrations.",
    categoryId: catCakes.id,
    price: 750,
    image: img.minibirthday,
    isFeatured: true,
    prepTimeMinutes: 180,
    tags: ["cake", "birthday", "mini", "custom"]
  },
  {
    name: "Cupcakes (Box of 12)",
    slug: "cupcakes-box-12",
    description: "A dozen cupcakes with beautiful rose-swirl buttercream. Perfect for parties and celebrations.",
    categoryId: catCakes.id,
    price: 320,
    image: img.cupcakes,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 90,
    tags: ["cupcakes", "party", "buttercream"]
  },
  {
    name: "Barbie Themed Birthday Cake",
    slug: "barbie-birthday-cake",
    description: "A stunning two-tier pink Barbie themed birthday cake — every little girl's dream come true.",
    categoryId: catCakes.id,
    price: 1850,
    image: img.barbiecake,
    isFeatured: true,
    prepTimeMinutes: 360,
    tags: ["cake", "barbie", "birthday", "themed", "custom", "two-tier"]
  },
  {
    name: "8\" Medium Cake",
    slug: "cake-8-medium",
    description: "An elegant 8-inch cake with pink ruffle piping and pearl details. Serves 14–18 guests.",
    categoryId: catCakes.id,
    price: 850,
    image: img.cake,
    isFeatured: true,
    prepTimeMinutes: 300,
    tags: ["cake", "birthday", "custom", "8 inch"]
  },
  {
    name: "8\" Birthday Cake",
    slug: "cake-8-birthday",
    description: "A gorgeous 8-inch pink ombre birthday cake with butterfly decorations. Serves 14–18 guests.",
    categoryId: catCakes.id,
    price: 1300,
    image: img.redvelvet,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 300,
    tags: ["cake", "birthday", "custom", "8 inch", "ombre"]
  },
  {
    name: "Matilda Chocolate",
    slug: "matilda-chocolate-cake",
    description: "A rich, indulgent multi-layer chocolate cake with glossy ganache. The ultimate chocolate lover's cake.",
    categoryId: catCakes.id,
    price: 2000,
    image: img.chocolatecake,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 360,
    tags: ["cake", "chocolate", "birthday", "custom", "ganache"]
  },
  {
    name: "Twin Cakes",
    slug: "twin-cakes",
    description: "Two matching cream cakes decorated with pink flowers, gold drip and Happy Birthday toppers. Perfect for twin celebrations.",
    categoryId: catCakes.id,
    price: 2600,
    image: img.twincakes,
    isFeatured: true,
    prepTimeMinutes: 480,
    tags: ["cake", "birthday", "twins", "custom", "celebration"]
  },

  // ── Pastries ──
  {
    name: "Chocolate Chip Muffins (Box of 4)",
    slug: "choc-chip-muffins-box-4",
    description: "Four generously sized freshly baked chocolate chip muffins — soft, golden and loaded with chocolate chips.",
    categoryId: catPastries.id,
    price: 140,
    image: img.muffins,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 45,
    tags: ["muffins", "chocolate", "snack", "baked"]
  },

  // ── Cooked Food ──
  {
    name: "Oven Grilled Chicken & Veggie Fried Rice",
    slug: "grilled-chicken-veggie-fried-rice",
    description: "Oven grilled chicken with veggie fried rice, coleslaw and a side of chilli sauce.",
    categoryId: catFood.id,
    price: 200,
    image: img.grilledchicken,
    isFeatured: true,
    prepTimeMinutes: 30,
    tags: ["chicken", "rice", "grilled", "lunch", "dinner"]
  },
  {
    name: "Creamy Pasta",
    slug: "creamy-pasta",
    description: "Rich and velvety pasta in a creamy tomato sauce, packed with flavour.",
    categoryId: catFood.id,
    price: 220,
    image: img.creamypasta,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 25,
    tags: ["pasta", "creamy", "lunch", "dinner"]
  },
  {
    name: "Beef Stew & Veggie Fried Rice",
    slug: "beef-stew-veggie-fried-rice",
    description: "Tender beef stew with potatoes and carrots in a rich tomato sauce, served with veggie fried rice.",
    categoryId: catFood.id,
    price: 220,
    image: img.beefstew,
    isFeatured: true,
    prepTimeMinutes: 30,
    tags: ["beef", "stew", "rice", "lunch", "dinner"]
  },
  {
    name: "Loaded Fries",
    slug: "loaded-fries",
    description: "Crispy golden fries topped with crunchy fried chicken and a generous drizzle of creamy mayo sauce.",
    categoryId: catFood.id,
    price: 120,
    image: img.fries,
    isTodaySpecial: true,
    prepTimeMinutes: 20,
    tags: ["fries", "snack", "lunch", "chicken"]
  },
  {
    name: "Beef Stir Fried Pasta",
    slug: "beef-stir-fried-pasta",
    description: "Wok-tossed pasta with seasoned beef strips, carrots and onions in a savoury stir-fry sauce.",
    categoryId: catFood.id,
    price: 200,
    image: img.pasta,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["pasta", "beef", "stir fry", "lunch", "dinner"]
  },
  {
    name: "Oven Grilled Chicken & Jollof Rice (Large)",
    slug: "grilled-chicken-jollof-rice-large",
    description: "A generous serving of oven grilled chicken with jollof rice and fresh coleslaw.",
    categoryId: catFood.id,
    price: 210,
    image: img.jollof,
    isFeatured: true,
    prepTimeMinutes: 30,
    tags: ["chicken", "jollof", "rice", "grilled", "lunch", "dinner"]
  },
  {
    name: "English Breakfast",
    slug: "english-breakfast",
    description: "A hearty full English breakfast with toast, scrambled eggs, sausage, fries and baked beans.",
    categoryId: catFood.id,
    price: 180,
    image: img.breakfast,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 25,
    tags: ["breakfast", "eggs", "sausage", "toast", "beans"]
  },
  {
    name: "Beef Stir Fried Rice",
    slug: "beef-stir-fried-rice",
    description: "Stir-fried rice with seasoned beef strips, carrots and vegetables in a savoury sauce.",
    categoryId: catFood.id,
    price: 200,
    image: img.stirfry,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["rice", "beef", "stir fry", "lunch", "dinner"]
  },
  {
    name: "Oven Grilled Chicken & Jollof Rice",
    slug: "grilled-chicken-jollof-rice",
    description: "Oven grilled chicken with jollof rice and fresh coleslaw on the side.",
    categoryId: catFood.id,
    price: 150,
    image: img.jollof,
    prepTimeMinutes: 30,
    tags: ["chicken", "jollof", "rice", "grilled", "lunch", "dinner"]
  },
  {
    name: "Chicken Stir Fried Rice",
    slug: "chicken-stir-fried-rice",
    description: "Chinese-style stir-fried rice with chicken, egg, mixed vegetables and spring onions, served with coleslaw.",
    categoryId: catFood.id,
    price: 200,
    image: img.friedrice,
    isFeatured: true,
    prepTimeMinutes: 25,
    tags: ["rice", "chicken", "stir fry", "chinese", "lunch", "dinner"]
  },
  {
    name: "Savory Platter",
    slug: "savory-platter",
    description: "A generous platter of steamed rice, fried plantains, sausage and oven grilled chicken with coleslaw and sides.",
    categoryId: catFood.id,
    price: 250,
    image: img.platter,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 35,
    tags: ["platter", "chicken", "rice", "plantain", "lunch", "dinner"]
  },
  {
    name: "Chicken Stew",
    slug: "chicken-stew",
    description: "Tender chicken pieces slow-cooked in a rich tomato stew, served with steamed rice and coleslaw.",
    categoryId: catFood.id,
    price: 200,
    image: img.chickenstew,
    isFeatured: true,
    prepTimeMinutes: 30,
    tags: ["chicken", "stew", "rice", "lunch", "dinner"]
  }
];

await prisma.product.createMany({
  data: products.map((p) => ({ ...p, isAvailable: true, stock: 50, images: [] }))
});

console.log(`✅  Menu updated — ${products.length} products across 3 categories.`);
process.exit(0);
