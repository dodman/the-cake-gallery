import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="font-semibold text-berry">Zambian-owned kitchen</p>
        <h1 className="mt-2 font-display text-5xl font-bold">Premium food with a warm local heart.</h1>
        <p className="mt-5 text-cocoa/70">The Cake Gallery prepares celebration cakes, pastries and cooked meals for busy families, offices and events. Our kitchen focuses on fresh ingredients, careful packaging and reliable delivery.</p>
        <p className="mt-4 text-cocoa/70">From birthday cakes to nshima lunch plates, every order is prepared to feel generous, polished and dependable.</p>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-premium">
        <Image src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80" alt="Kitchen preparation" fill className="object-cover" />
      </div>
    </section>
  );
}

