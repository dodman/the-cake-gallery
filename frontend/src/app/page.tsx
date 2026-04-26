import Image from "next/image";
import { ArrowRight, CakeSlice, Clock, MapPin, Truck, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackCategories, fallbackProducts } from "@/lib/demoData";
import { ProductCard } from "@/components/ProductCard";
import { LinkButton } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default async function HomePage() {
  const [{ products }, { categories }] = await Promise.all([
    api.getProducts("?featured=true").catch(() => ({ products: fallbackProducts })),
    api.getCategories().catch(() => ({ categories: fallbackCategories }))
  ]);
  const specials = products.filter((product) => product.isTodaySpecial).concat(fallbackProducts.filter((product) => product.isTodaySpecial)).slice(0, 3);

  const highlights: Array<{ icon: LucideIcon; label: string }> = [
    { icon: Truck, label: "Delivery & pickup" },
    { icon: Clock, label: "Same-day meals" },
    { icon: CakeSlice, label: "Custom cakes" },
    { icon: MapPin, label: "Lusaka areas" }
  ];

  return (
    <>
      <section className="relative min-h-[86vh] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1800&q=80" alt="The Cake Gallery cakes and pastries" fill priority className="object-cover" />
        <div className="image-overlay absolute inset-0" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-center px-4 py-16 text-white">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">Freshly prepared in Lusaka</p>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">The Cake Gallery</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">Luxury cakes, muffins, pastries and cooked meals for delivery and pickup. Order breakfast, lunch, dinner, snacks and celebration cakes online.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/menu" variant="accent">Order Now <ArrowRight size={18} /></LinkButton>
              <LinkButton href="/cakes" variant="ghost">Custom Birthday Cake</LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-4">
        {highlights.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
            <Icon className="text-berry" />
            <span className="font-semibold">{label}</span>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-bold">Featured Products</h2>
            <p className="mt-2 text-cocoa/65">Customer favorites for celebrations, work lunches and family dinners.</p>
          </div>
          <LinkButton href="/menu" variant="ghost" className="hidden md:inline-flex">View Menu</LinkButton>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="font-semibold text-berry">Today&apos;s Specials</p>
            <h2 className="mt-2 font-display text-4xl font-bold">Warm plates and fresh bakes ready for your table.</h2>
            <p className="mt-4 text-cocoa/65">Daily specials rotate based on fresh ingredients and kitchen availability.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {specials.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-display text-4xl font-bold">Shop by Category</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <a key={category.id} href={`/menu?category=${category.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
              <Image src={category.image ?? fallbackCategories[0].image!} alt={category.name} fill className="object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/80 to-transparent" />
              <div className="absolute bottom-0 p-5 text-white">
                <h3 className="font-display text-2xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/75">{category.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-cocoa py-14 text-cream">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
          {["The birthday cake was stunning and tasted rich.", "Lunch delivery arrived hot and well packed.", "Best muffins for our office meetings."].map((quote, index) => (
            <blockquote key={quote} className="rounded-lg bg-white/10 p-6">
              <p className="text-lg">&quot;{quote}&quot;</p>
              <footer className="mt-4 text-sm text-cream/70">Customer {index + 1}</footer>
            </blockquote>
          ))}
        </div>
      </section>
      <WhatsAppButton />
    </>
  );
}
