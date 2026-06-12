"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button, LinkButton } from "@/components/Button";
import { money } from "@/lib/format";
import { useCart } from "@/store/cart";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-8 text-center">
          <p>Your cart is empty.</p>
          <LinkButton href="/menu" className="mt-4">Browse Menu</LinkButton>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg bg-white p-4">
                <div className="relative aspect-square overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
                <div>
                  <div className="flex justify-between gap-3">
                    <Link href={`/products/${item.slug}`} className="font-semibold">{item.name}</Link>
                    <button onClick={() => removeItem(item.id)} aria-label="Remove item"><Trash2 size={18} /></button>
                  </div>
                  <p className="mt-1 text-sm text-cocoa/60">{money(item.price)}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="ghost" className="px-3 py-2" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button variant="ghost" className="px-3 py-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="h-fit rounded-lg bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-bold">Summary</h2>
            <div className="mt-4 flex justify-between"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <p className="mt-2 text-sm text-cocoa/60">Delivery fee is calculated at checkout.</p>
            <LinkButton href="/checkout" className="mt-5 w-full">Checkout</LinkButton>
          </aside>
        </div>
      )}
    </section>
  );
}

