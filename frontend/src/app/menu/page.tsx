import { api } from "@/lib/api";
import { fallbackCategories, fallbackProducts } from "@/lib/demoData";
import { MenuGrid } from "@/components/MenuGrid";

export default async function MenuPage({ searchParams }: { searchParams: { category?: string } }) {
  const [{ products }, { categories }] = await Promise.all([
    api.getProducts().catch(() => ({ products: fallbackProducts })),
    api.getCategories().catch(() => ({ categories: fallbackCategories }))
  ]);

  return <MenuGrid products={products} categories={categories} initialCategory={searchParams.category} />;
}

