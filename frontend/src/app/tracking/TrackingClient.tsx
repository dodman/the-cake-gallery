"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import type { Order } from "@/types";

const statuses = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

export function TrackingClient() {
  const params = useSearchParams();
  const { token } = useAuth();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  async function track() {
    if (!token) {
      setError("Please login to track your order.");
      return;
    }
    try {
      const result = await api.getOrder(token, code);
      setOrder(result.order);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Order Tracking</h1>
      <div className="mt-6 flex gap-2">
        <input className="focus-ring min-w-0 flex-1 rounded-md border border-cocoa/15 bg-white p-3" value={code} onChange={(event) => setCode(event.target.value)} placeholder="Tracking code e.g. SBK-123ABC" />
        <Button onClick={track}>Track</Button>
      </div>
      {error && <p className="mt-4 rounded-md bg-berry/10 p-3 text-berry">{error}</p>}
      {order && (
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              <p className="text-sm text-cocoa/60">Tracking Code</p>
              <h2 className="font-display text-3xl font-bold">{order.trackingCode}</h2>
            </div>
            <strong className="text-berry">{money(order.total)}</strong>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {statuses.map((status, index) => {
              const active = statuses.indexOf(order.status) >= index;
              return <div key={status} className={`rounded-md p-4 text-center text-sm font-semibold ${active ? "bg-honey text-cocoa" : "bg-cream text-cocoa/50"}`}>{status}</div>;
            })}
          </div>
        </div>
      )}
    </section>
  );
}
