"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/Button";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [areas, setAreas] = useState<Array<{ area: string; fee: number }>>([]);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [deliveryArea, setDeliveryArea] = useState("Lusaka CBD");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Airtel Money");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const deliveryFee = fulfillment === "delivery" ? areas.find((area) => area.area === deliveryArea)?.fee ?? 0 : 0;
  const total = useMemo(() => subtotal + deliveryFee, [deliveryFee, subtotal]);

  useEffect(() => {
    api.deliveryAreas().then((result) => setAreas(result.areas)).catch(() => setAreas([{ area: "Lusaka CBD", fee: 35 }, { area: "Kabulonga", fee: 45 }]));
  }, []);

  async function placeOrder() {
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const result = await api.createOrder(token, {
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        paymentMethod,
        fulfillment,
        deliveryArea,
        deliveryAddress,
        couponCode: couponCode || undefined
      });
      clear();
      router.push(`/tracking?code=${result.order.trackingCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    }
  }

  if (!items.length) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-5xl font-bold">Checkout</h1>
        <p className="mt-4">Your cart is empty.</p>
        <LinkButton href="/menu" className="mt-4">Browse Menu</LinkButton>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-5 rounded-lg bg-white p-5">
          <div>
            <h2 className="font-display text-2xl font-bold">Delivery Method</h2>
            <div className="mt-3 flex gap-2">
              {(["delivery", "pickup"] as const).map((value) => <button key={value} onClick={() => setFulfillment(value)} className={`rounded-md px-4 py-2 font-semibold ${fulfillment === value ? "bg-cocoa text-white" : "bg-cream"}`}>{value}</button>)}
            </div>
          </div>
          {fulfillment === "delivery" && (
            <>
              <select className="focus-ring rounded-md border border-cocoa/15 p-3" value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)}>
                {areas.map((area) => <option key={area.area} value={area.area}>{area.area} ({money(area.fee)})</option>)}
              </select>
              <textarea className="focus-ring rounded-md border border-cocoa/15 p-3" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Delivery address and landmarks" />
            </>
          )}
          <div>
            <h2 className="font-display text-2xl font-bold">Payment</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {["Airtel Money", "MTN MoMo", "Cash on Delivery"].map((method) => <button key={method} onClick={() => setPaymentMethod(method)} className={`rounded-md px-4 py-3 font-semibold ${paymentMethod === method ? "bg-cocoa text-white" : "bg-cream"}`}>{method}</button>)}
            </div>
          </div>
          <input className="focus-ring rounded-md border border-cocoa/15 p-3" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Coupon code" />
          {error && <p className="rounded-md bg-berry/10 p-3 text-sm text-berry">{error}</p>}
        </div>
        <aside className="h-fit rounded-lg bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-bold">Order Summary</h2>
          <div className="mt-4 grid gap-2 text-sm">
            {items.map((item) => <div key={item.id} className="flex justify-between"><span>{item.quantity} x {item.name}</span><span>{money(item.price * item.quantity)}</span></div>)}
          </div>
          <div className="mt-5 border-t border-cocoa/10 pt-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="mt-2 flex justify-between"><span>Delivery</span><span>{money(deliveryFee)}</span></div>
            <div className="mt-3 flex justify-between text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
          </div>
          <Button className="mt-5 w-full" onClick={placeOrder}>Place Order</Button>
        </aside>
      </div>
    </section>
  );
}

