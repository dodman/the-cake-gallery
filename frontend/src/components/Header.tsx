"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";

const nav = [
  ["Home", "/"],
  ["Menu", "/menu"],
  ["Cakes", "/cakes"],
  ["Pastries", "/muffins-pastries"],
  ["Cooked Food", "/cooked-food"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-cocoa/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl font-bold text-cocoa">The Cake Gallery</Link>
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {nav.map(([label, href]) => <Link key={href} href={href} className="hover:text-berry">{label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={user ? "/dashboard" : "/login"} className="focus-ring rounded-md p-2" aria-label="Account">
            <UserRound size={22} />
          </Link>
          <Link href="/cart" className="focus-ring relative rounded-md p-2" aria-label="Cart">
            <ShoppingBag size={22} />
            {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-berry px-1.5 text-xs text-white">{count}</span>}
          </Link>
          <button className="focus-ring rounded-md p-2 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-cocoa/10 bg-cream px-4 py-3 lg:hidden">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="block py-2 font-medium" onClick={() => setOpen(false)}>{label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

