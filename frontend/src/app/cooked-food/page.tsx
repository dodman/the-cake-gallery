import { MenuGrid } from "@/components/MenuGrid";
import { api } from "@/lib/api";
import { fallbackCategories, fallbackProducts } from "@/lib/demoData";

export default async function CookedFoodPage() {
  const [{ products }, { categories }] = await Promise.all([
    api.getProducts("?category=cooked-food").catch(() => ({ products: fallbackProducts.filter((product) => product.category.slug === "cooked-food") })),
    api.getCategories().catch(() => ({ categories: fallbackCategories }))
  ]);
  return <MenuGrid products={products} categories={categories} initialCategory="cooked-food" />;
}

