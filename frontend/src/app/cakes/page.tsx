import { MenuGrid } from "@/components/MenuGrid";
import { api } from "@/lib/api";
import { fallbackCategories, fallbackProducts } from "@/lib/demoData";
import { BirthdayCakeForm } from "./BirthdayCakeForm";

export default async function CakesPage() {
  const [{ products }, { categories }] = await Promise.all([
    api.getProducts("?category=cakes").catch(() => ({ products: fallbackProducts.filter((product) => product.category.slug === "cakes") })),
    api.getCategories().catch(() => ({ categories: fallbackCategories }))
  ]);
  return (
    <>
      <MenuGrid products={products} categories={categories} initialCategory="cakes" />
      <BirthdayCakeForm />
    </>
  );
}

