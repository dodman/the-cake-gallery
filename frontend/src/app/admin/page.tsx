"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { money } from "@/lib/format";
import { useAuth } from "@/store/auth";
import type { ContactMessage, ContactReply, Order, Product, Review, User } from "@/types";

type Stats = { dailySales: number; dailyOrders: number; totalOrders: number; totalUsers: number; topProducts: Product[] };
type Tab = "orders" | "users" | "reviews" | "messages";

export default function AdminPage() {
  const { token, user } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});
  const [replySending, setReplySending] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!token || user?.role !== "admin") return;
    api.adminStats(token).then(setStats).catch(() => null);
    api.adminOrders(token).then((r) => setOrders(r.orders)).catch(() => null);
    api.adminUsers(token).then((r) => setUsers(r.users)).catch(() => null);
    api.adminListReviews(token).then((r) => setReviews(r.reviews)).catch(() => null);
    api.adminMessages(token).then((r) => setMessages(r.messages)).catch(() => null);
  }, [token, user?.role]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    const result = await api.updateOrderStatus(token, id, status);
    setOrders((cur) => cur.map((o) => (o.id === id ? result.order : o)));
  }

  async function toggleRole(u: User) {
    if (!token) return;
    const newRole = u.role === "admin" ? "customer" : "admin";
    if (!confirm(`Change ${u.name} to ${newRole}?`)) return;
    const result = await api.updateUserRole(token, u.id, newRole);
    setUsers((cur) => cur.map((x) => (x.id === u.id ? { ...x, role: result.user.role } : x)));
  }

  async function approveReview(id: string, approve: boolean) {
    if (!token) return;
    await api.adminApproveReview(token, id, approve);
    setReviews((cur) => cur.map((r) => (r.id === id ? { ...r, isApproved: approve } : r)));
  }

  async function removeReview(id: string) {
    if (!token || !confirm("Delete this review?")) return;
    await api.adminDeleteReview(token, id);
    setReviews((cur) => cur.filter((r) => r.id !== id));
  }

  async function sendReply(id: string) {
    const content = (replyDrafts[id] ?? "").trim();
    if (!token || !content) return;
    setReplySending((cur) => ({ ...cur, [id]: true }));
    try {
      const { reply } = await api.adminReplyToMessage(token, id, content);
      setMessages((cur) =>
        cur.map((m) =>
          m.id === id
            ? { ...m, isRead: true, replies: [...(m.replies ?? []), reply] }
            : m
        )
      );
      setReplyDrafts((cur) => ({ ...cur, [id]: "" }));
      setReplyOpen((cur) => ({ ...cur, [id]: false }));
    } catch {
      alert("Failed to send reply.");
    } finally {
      setReplySending((cur) => ({ ...cur, [id]: false }));
    }
  }

  async function markRead(id: string) {
    if (!token) return;
    await api.adminMarkMessageRead(token, id);
    setMessages((cur) => cur.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
  }

  async function deleteMsg(id: string) {
    if (!token || !confirm("Delete this message?")) return;
    await api.adminDeleteMessage(token, id);
    setMessages((cur) => cur.filter((m) => m.id !== id));
  }

  if (!token || user?.role !== "admin") {
    return (
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-5xl font-bold">Admin Dashboard</h1>
        <p className="mt-4">Admin login required.</p>
      </section>
    );
  }

  const unreadMsgs = messages.filter((m) => !m.isRead).length;
  const pendingReviews = reviews.filter((r) => !r.isApproved).length;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
    { id: "reviews", label: "Reviews", badge: pendingReviews },
    { id: "messages", label: "Messages", badge: unreadMsgs }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-5xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Metric label="Daily Sales" value={money(stats?.dailySales ?? 0)} />
        <Metric label="Daily Orders" value={String(stats?.dailyOrders ?? 0)} />
        <Metric label="Total Orders" value={String(stats?.totalOrders ?? 0)} />
        <Metric label="Customers" value={String(stats?.totalUsers ?? 0)} />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-lg bg-white p-1 shadow-sm w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-md px-5 py-2 text-sm font-semibold transition ${
              tab === t.id ? "bg-cocoa text-white" : "text-cocoa/60 hover:text-cocoa"
            }`}
          >
            {t.label}
            {(t.badge ?? 0) > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-berry text-[10px] font-bold text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="mt-4 rounded-lg bg-white p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Manage Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Code</th>
                  <th className="pr-4">Customer</th>
                  <th className="pr-4">Total</th>
                  <th className="pr-4">Status</th>
                  <th className="pr-4">Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const o = order as Order & { user?: { name?: string } };
                  return (
                    <tr key={order.id} className="border-b border-cocoa/10">
                      <td className="py-3 pr-4 font-semibold">{order.trackingCode}</td>
                      <td className="pr-4 text-cocoa/70">{o.user?.name ?? "—"}</td>
                      <td className="pr-4">{money(order.total)}</td>
                      <td className="pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          order.status === "Delivered" ? "bg-green-100 text-green-700"
                          : order.status === "Pending" ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                        }`}>{order.status}</span>
                      </td>
                      <td className="pr-4 text-cocoa/70">{order.paymentMethod}</td>
                      <td>
                        <select
                          className="rounded-md border border-cocoa/15 p-1.5 text-sm"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          {["Pending", "Preparing", "Out for Delivery", "Delivered"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {!orders.length && <tr><td colSpan={6} className="py-6 text-center text-cocoa/40">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users tab */}
      {tab === "users" && (
        <div className="mt-4 rounded-lg bg-white p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Registered Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 pr-4">Name</th>
                  <th className="pr-4">Email</th>
                  <th className="pr-4">Phone</th>
                  <th className="pr-4">Role</th>
                  <th className="pr-4">Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-cocoa/10">
                    <td className="py-3 pr-4 font-semibold">{u.name}</td>
                    <td className="pr-4 text-cocoa/70">{u.email}</td>
                    <td className="pr-4 text-cocoa/70">{u.phone}</td>
                    <td className="pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>{u.role}</span>
                    </td>
                    <td className="pr-4 text-cocoa/60">
                      {new Date((u as User & { createdAt?: string }).createdAt ?? "").toLocaleDateString()}
                    </td>
                    <td>
                      {u.id !== user?.id && (
                        <button
                          onClick={() => toggleRole(u)}
                          className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                            u.role === "admin"
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "border border-purple-200 text-purple-700 hover:bg-purple-50"
                          }`}
                        >
                          {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!users.length && <tr><td colSpan={6} className="py-6 text-center text-cocoa/40">No users yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews tab */}
      {tab === "reviews" && (
        <div className="mt-4 rounded-lg bg-white p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Review Approvals</h2>
          <div className="grid gap-3">
            {reviews.map((review) => (
              <div key={review.id} className={`rounded-lg border p-4 ${review.isApproved ? "border-green-200 bg-green-50/40" : "border-amber-200 bg-amber-50/40"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{review.user?.name ?? "Unknown"}</span>
                      <span className="text-cocoa/50 text-xs">{review.user?.email}</span>
                      <span className="text-cocoa/50 text-xs">·</span>
                      <span className="text-sm font-medium">{review.product?.name}</span>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={s <= review.rating ? "text-amber-400 text-sm" : "text-cocoa/20 text-sm"}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-cocoa/80">&ldquo;{review.comment}&rdquo;</p>
                    <p className="mt-1 text-xs text-cocoa/40">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!review.isApproved ? (
                      <button
                        onClick={() => approveReview(review.id, true)}
                        className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => approveReview(review.id, false)}
                        className="rounded-md border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                      >
                        Unapprove
                      </button>
                    )}
                    <button
                      onClick={() => removeReview(review.id)}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!reviews.length && <p className="py-6 text-center text-cocoa/40">No reviews yet.</p>}
          </div>
        </div>
      )}

      {/* Messages tab */}
      {tab === "messages" && (
        <div className="mt-4 rounded-lg bg-white p-5">
          <h2 className="font-display text-2xl font-bold mb-4">Contact Messages</h2>
          <div className="grid gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`rounded-xl border ${msg.isRead ? "border-cocoa/10" : "border-blue-200 bg-blue-50/30"}`}>
                {/* Message header */}
                <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {!msg.isRead && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                      <span className="font-semibold">{msg.name}</span>
                      <span className="text-cocoa/60 text-sm">{msg.email}</span>
                      <span className="text-xs text-cocoa/40">{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-cocoa/80 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setReplyOpen((cur) => ({ ...cur, [msg.id]: !cur[msg.id] }))}
                      className="rounded-md bg-cocoa px-3 py-1 text-xs font-semibold text-white hover:bg-cocoa/90"
                    >
                      {replyOpen[msg.id] ? "Cancel" : "Reply"}
                    </button>
                    {!msg.isRead && (
                      <button
                        onClick={() => markRead(msg.id)}
                        className="rounded-md border border-cocoa/20 px-3 py-1 text-xs font-semibold text-cocoa/70 hover:bg-cream"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMsg(msg.id)}
                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Previous replies thread */}
                {(msg.replies ?? []).length > 0 && (
                  <div className="border-t border-cocoa/10 bg-cream/50 px-4 py-3 grid gap-2">
                    {(msg.replies as ContactReply[]).map((reply) => (
                      <div key={reply.id} className="ml-4 rounded-lg bg-white border border-cocoa/10 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-berry">The Cake Gallery</span>
                          <span className="text-xs text-cocoa/40">{new Date(reply.sentAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-cocoa/80 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply compose box */}
                {replyOpen[msg.id] && (
                  <div className="border-t border-cocoa/10 p-4 bg-cream/30">
                    <p className="text-xs font-semibold text-cocoa/50 mb-2">
                      Replying to {msg.name} &lt;{msg.email}&gt;
                      {" · "}reply will also be sent as an email
                    </p>
                    <textarea
                      className="w-full rounded-lg border border-cocoa/15 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-berry/40"
                      rows={4}
                      placeholder={`Hi ${msg.name},\n\nThank you for reaching out…`}
                      value={replyDrafts[msg.id] ?? ""}
                      onChange={(e) => setReplyDrafts((cur) => ({ ...cur, [msg.id]: e.target.value }))}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setReplyOpen((cur) => ({ ...cur, [msg.id]: false }))}
                        className="rounded-md border border-cocoa/20 px-4 py-1.5 text-sm font-semibold hover:bg-cream"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendReply(msg.id)}
                        disabled={replySending[msg.id] || !(replyDrafts[msg.id] ?? "").trim()}
                        className="rounded-md bg-berry px-4 py-1.5 text-sm font-semibold text-white hover:bg-berry/90 disabled:opacity-50"
                      >
                        {replySending[msg.id] ? "Sending…" : "Send Reply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!messages.length && <p className="py-6 text-center text-cocoa/40">No messages yet.</p>}
          </div>
        </div>
      )}

      {/* Top sellers sidebar — only on orders tab */}
      {tab === "orders" && stats?.topProducts?.length ? (
        <div className="mt-4 rounded-lg bg-white p-5">
          <h2 className="font-display text-xl font-bold mb-3">Top Sellers</h2>
          <div className="grid gap-2">
            {stats.topProducts.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.name}</span>
                <strong>{p.soldCount} sold</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm">
      <p className="text-sm text-cocoa/60">{label}</p>
      <strong className="mt-2 block text-2xl">{value}</strong>
    </div>
  );
}
