"use client";

import { useEffect, useState } from "react";
import { LinkButton } from "@/components/Button";
import { ReviewPopup } from "@/components/ReviewPopup";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import type { Order } from "@/types";

const REVIEWED_KEY = "tcg_reviewed_orders";

function getReviewedOrders(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(REVIEWED_KEY) ?? "[]"); } catch { return []; }
}
function markOrderReviewed(orderId: string) {
  const current = getReviewedOrders();
  if (!current.includes(orderId)) {
    localStorage.setItem(REVIEWED_KEY, JSON.stringify([...current, orderId]));
  }
}

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (token) {
      api.myOrders(token).then((result) => {
        setOrders(result.orders);
        // Show review popup for the first delivered order not yet prompted
        const reviewed = getReviewedOrders();
        const pending = result.orders.find(
          (o) => o.status === "Delivered" && !reviewed.includes(o.id)
        );
        if (pending) setReviewOrder(pending);
      }).catch(() => setOrders([]));
    }
  }, [token]);

  function handleReviewClose() {
    if (reviewOrder) markOrderReviewed(reviewOrder.id);
    setReviewOrder(null);
  }

  if (!token) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-5xl font-bold">Customer Dashboard</h1>
        <p className="mt-4">Please login to view orders and favorites.</p>
        <LinkButton href="/login" className="mt-4">Login</LinkButton>
      </section>
    );
  }

  return (
    <>
      {reviewOrder && token && (
        <ReviewPopup order={reviewOrder} token={token} onClose={handleReviewClose} />
      )}

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-5xl font-bold">Customer Dashboard</h1>
            <p className="mt-2 text-cocoa/65">Welcome, {user?.name}</p>
          </div>
          <button className="rounded-md bg-white px-4 py-2 font-semibold" onClick={logout}>Logout</button>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="rounded-lg bg-white p-5">
            <h2 className="font-display text-2xl font-bold">Previous Orders</h2>
            <div className="mt-4 grid gap-3">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-cream p-4">
                  <div>
                    <strong>{order.trackingCode}</strong>
                    <p className="text-sm text-cocoa/60">{order.status} · {order.items.length} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{money(order.total)}</span>
                    <LinkButton href={`/tracking?code=${order.trackingCode}`} variant="ghost" className="py-2">Track</LinkButton>
                    {order.status === "Delivered" && (
                      <button
                        onClick={() => setReviewOrder(order)}
                        className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-100"
                      >
                        ★ Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!orders.length && <p className="text-cocoa/60">No orders yet.</p>}
            </div>
          </div>
          <aside className="rounded-lg bg-white p-5">
            <h2 className="font-display text-2xl font-bold">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <LinkButton href="/menu" variant="accent">Reorder Meals</LinkButton>
              <LinkButton href="/cakes" variant="ghost">Custom Cake</LinkButton>
              {user?.role === "admin" && <LinkButton href="/admin" variant="primary">Admin Dashboard</LinkButton>}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
