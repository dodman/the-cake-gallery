import type { Category, Product } from "@/types";

export const fallbackCategories: Category[] = [
  { id: "1", name: "Cakes", slug: "cakes", description: "Celebration cakes and cupcakes.", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80" },
  { id: "2", name: "Muffins & Pastries", slug: "muffins-pastries", description: "Fresh bakery favorites.", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80" },
  { id: "3", name: "Cooked Food", slug: "cooked-food", description: "Breakfast, lunch and dinner meals.", image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80" },
  { id: "4", name: "Drinks", slug: "drinks", description: "Fresh juices and beverages.", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80" }
];

const category = fallbackCategories[0];

export const fallbackProducts: Product[] = [
  {
    id: "p1",
    name: "Luxury Chocolate Birthday Cake",
    slug: "luxury-chocolate-birthday-cake",
    description: "Moist chocolate sponge layered with silky buttercream.",
    category,
    price: 650,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    images: [],
    isAvailable: true,
    isFeatured: true,
    isTodaySpecial: true,
    prepTimeMinutes: 180,
    stock: 12,
    ratingAverage: 4.9,
    ratingCount: 32,
    soldCount: 140,
    tags: ["birthday", "custom"]
  },
  {
    id: "p2",
    name: "Chicken Nshima Lunch",
    slug: "chicken-nshima-lunch",
    description: "Tender chicken stew served with nshima and seasonal vegetables.",
    category: fallbackCategories[2],
    price: 120,
    image: "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1200&q=80",
    images: [],
    isAvailable: true,
    isFeatured: true,
    isTodaySpecial: false,
    prepTimeMinutes: 35,
    stock: 40,
    ratingAverage: 4.7,
    ratingCount: 21,
    soldCount: 95,
    tags: ["zambian", "lunch"]
  },
  {
    id: "p3",
    name: "Blueberry Muffins",
    slug: "blueberry-muffins",
    description: "Fresh baked muffins packed with blueberries.",
    category: fallbackCategories[1],
    price: 35,
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=1200&q=80",
    images: [],
    isAvailable: true,
    isFeatured: false,
    isTodaySpecial: true,
    prepTimeMinutes: 25,
    stock: 50,
    ratingAverage: 4.8,
    ratingCount: 18,
    soldCount: 160,
    tags: ["breakfast"]
  }
];
