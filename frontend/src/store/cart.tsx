"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CartItem, Product } from "@/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem(product, quantity = 1) {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
        }
        return [...current, { ...product, quantity }];
      });
    },
    updateQuantity(id, quantity) {
      setItems((current) => current.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0));
    },
    removeItem(id) {
      setItems((current) => current.filter((item) => item.id !== id));
    },
    clear() {
      setItems([]);
    },
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
