import { MenuGrid } from "@/components/MenuGrid";
import { api } from "@/lib/api";
import { fallbackCategories, fallbackProducts } from "@/lib/demoData";

export default async function MuffinsPage() {
  const [{ products }, { categories }] = await Promise.all([
    api.getProducts("?category=muffins-pastries").catch(() => ({ products: fallbackProducts.filter((product) => product.category.slug === "muffins-pastries") })),
    api.getCategories().catch(() => ({ categories: fallbackCategories }))
  ]);
  return <MenuGrid products={products} categories={categories} initialCategory="muffins-pastries" />;
}

