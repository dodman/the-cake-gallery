import { api } from "@/lib/api";
import { fallbackProducts } from "@/lib/demoData";
import { money } from "@/lib/format";
import { AddToCart } from "./AddToCart";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { product } = await api.getProduct(params.slug).catch(() => ({ product: fallbackProducts.find((item) => item.slug === params.slug) ?? fallbackProducts[0] }));

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-premium">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div>
        <p className="font-semibold text-berry">{product.category.name}</p>
        <h1 className="mt-2 font-display text-5xl font-bold">{product.name}</h1>
        <p className="mt-4 text-lg text-cocoa/70">{product.description}</p>
        <p className="mt-6 text-3xl font-bold text-berry">{money(product.price)}</p>
        <p className="mt-2 text-sm text-cocoa/60">Preparation time: {product.prepTimeMinutes} minutes</p>
        <AddToCart product={product} />
      </div>
    </section>
  );
}

