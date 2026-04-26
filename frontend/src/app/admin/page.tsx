"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import type { Order, Product, User } from "@/types";

type Stats = { dailySales: number; dailyOrders: number; totalOrders: number; totalUsers: number; topProducts: Product[] };

export default function AdminPage() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    api.adminStats(token).then(setStats).catch(() => null);
    api.adminOrders(token).then((result) => setOrders(result.orders)).catch(() => null);
    api.adminUsers(token).then((result) => setUsers(result.users)).catch(() => null);
  }, [token, user?.role]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    const result = await api.updateOrderStatus(token, id, status);
    setOrders((current) => current.map((order) => (order._id === id ? result.order : order)));
  }

  if (!token || user?.role !== "admin") {
    return <section className="mx-auto max-w-4xl px-4 py-12"><h1 className="font-display text-5xl font-bold">Admin Dashboard</h1><p className="mt-4">Admin login required.</p></section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Admin Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Daily Sales" value={money(stats?.dailySales ?? 0)} />
        <Metric label="Daily Orders" value={String(stats?.dailyOrders ?? 0)} />
        <Metric label="Total Orders" value={String(stats?.totalOrders ?? 0)} />
        <Metric label="Customers" value={String(stats?.totalUsers ?? 0)} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-lg bg-white p-5">
          <h2 className="font-display text-2xl font-bold">Manage Orders</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead><tr className="border-b"><th className="py-2">Code</th><th>Total</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-cocoa/10">
                    <td className="py-3 font-semibold">{order.trackingCode}</td>
                    <td>{money(order.total)}</td>
                    <td>{order.status}</td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <select className="rounded-md border border-cocoa/15 p-2" value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
                        {["Pending", "Preparing", "Out for Delivery", "Delivered"].map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-lg bg-white p-5">
            <h2 className="font-display text-2xl font-bold">Top Sellers</h2>
            <div className="mt-3 grid gap-2">
              {stats?.topProducts?.map((product) => <div key={product._id} className="flex justify-between text-sm"><span>{product.name}</span><strong>{product.soldCount}</strong></div>)}
            </div>
          </div>
          <div className="rounded-lg bg-white p-5">
            <h2 className="font-display text-2xl font-bold">Users</h2>
            <p className="mt-2 text-sm text-cocoa/60">{users.length} registered accounts</p>
          </div>
          <div className="rounded-lg bg-white p-5">
            <h2 className="font-display text-2xl font-bold">Catalog Tools</h2>
            <p className="mt-2 text-sm text-cocoa/60">Product, image upload and coupon APIs are ready for connecting custom forms or a CMS.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white p-5 shadow-sm"><p className="text-sm text-cocoa/60">{label}</p><strong className="mt-2 block text-2xl">{value}</strong></div>;
}

