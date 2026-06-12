"use client";

import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "@/types";
import { money } from "@/lib/format";
import { useCart } from "@/store/cart";
import { Button } from "./Button";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="overflow-hidden rounded-lg border border-cocoa/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        {product.isTodaySpecial && <span className="absolute left-3 top-3 rounded-full bg-honey px-3 py-1 text-xs font-bold text-cocoa">Today</span>}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.slug}`} className="font-display text-xl font-bold hover:text-berry">{product.name}</Link>
            <p className="mt-1 line-clamp-2 text-sm text-cocoa/65">{product.description}</p>
          </div>
          <button className="focus-ring rounded-md p-2 text-berry" aria-label="Save favorite"><Heart size={18} /></button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-berry">{money(product.price)}</p>
            <p className="flex items-center gap-1 text-xs text-cocoa/60"><Star size={14} className="fill-honey text-honey" /> {product.ratingAverage || "New"}</p>
          </div>
          <Button variant="accent" className="px-3 py-2" onClick={() => addItem(product)}>
            <Plus size={18} /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}

