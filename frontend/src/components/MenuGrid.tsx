"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function MenuGrid({ products, categories, initialCategory }: { products: Product[]; categories: Category[]; initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "all" || product.category.slug === category;
    const text = `${product.name} ${product.description} ${product.tags.join(" ")}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }), [category, products, query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Order Online</h1>
          <p className="mt-2 text-cocoa/65">Browse cakes, pastries, cooked meals, snacks and drinks.</p>
        </div>
        <label className="relative block md:w-80">
          <Search className="absolute left-3 top-3 text-cocoa/45" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="focus-ring w-full rounded-md border border-cocoa/15 bg-white py-3 pl-10 pr-3" placeholder="Search food" />
        </label>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <button onClick={() => setCategory("all")} className={`rounded-md px-4 py-2 text-sm font-semibold ${category === "all" ? "bg-cocoa text-white" : "bg-white"}`}>All</button>
        {categories.map((item) => (
          <button key={item._id} onClick={() => setCategory(item.slug)} className={`whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold ${category === item.slug ? "bg-cocoa text-white" : "bg-white"}`}>{item.name}</button>
        ))}
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  );
}

