"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useCart } from "@/store/cart";
import type { Product } from "@/types";

export function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <input className="focus-ring w-24 rounded-md border border-cocoa/15 p-3" type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
      <Button onClick={() => addItem(product, quantity)}>Add to Cart</Button>
    </div>
  );
}

