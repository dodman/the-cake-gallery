import type { Category, ContactMessage, ContactReply, Order, Product, Review, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

type ApiOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.token) headers.set("Authorization", `Bearer ${options.token}`);

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store"
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Products & categories
  getProducts: (params = "") => request<{ products: Product[] }>(`/products${params}`),
  getCategories: () => request<{ categories: Category[] }>("/categories"),
  getProduct: (slug: string) => request<{ product: Product }>(`/products/${slug}`),

  // Auth
  register: (body: unknown) => request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: unknown) => request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: (token: string) => request<{ user: User }>("/auth/me", { token }),

  // Orders
  deliveryAreas: () => request<{ areas: Array<{ area: string; fee: number }> }>("/orders/delivery-areas"),
  createOrder: (token: string, body: unknown) => request<{ order: Order }>("/orders", { method: "POST", token, body: JSON.stringify(body) }),
  myOrders: (token: string) => request<{ orders: Order[] }>("/orders/mine", { token }),
  getOrder: (token: string, trackingCode: string) => request<{ order: Order }>(`/orders/${trackingCode}`, { token }),

  // Favorites
  toggleFavorite: (token: string, productId: string) => request<{ favorites: Product[] }>(`/users/favorites/${productId}`, { method: "POST", token }),

  // Reviews
  getApprovedReviews: () => request<{ reviews: Review[] }>("/reviews/approved"),
  createReview: (token: string, body: { productId: string; rating: number; comment: string }) =>
    request<{ review: Review }>("/reviews", { method: "POST", token, body: JSON.stringify(body) }),
  adminListReviews: (token: string) => request<{ reviews: Review[] }>("/reviews/admin/all", { token }),
  adminApproveReview: (token: string, id: string, isApproved: boolean) =>
    request<{ review: Review }>(`/reviews/${id}/approve`, { method: "PATCH", token, body: JSON.stringify({ isApproved }) }),
  adminDeleteReview: (token: string, id: string) =>
    request<void>(`/reviews/${id}`, { method: "DELETE", token }),

  // Contact
  sendMessage: (body: { name: string; email: string; message: string }) =>
    request<{ message: ContactMessage }>("/contact", { method: "POST", body: JSON.stringify(body) }),
  adminMessages: (token: string) => request<{ messages: ContactMessage[] }>("/contact", { token }),
  adminReplyToMessage: (token: string, id: string, content: string) =>
    request<{ reply: ContactReply }>(`/contact/${id}/reply`, { method: "POST", token, body: JSON.stringify({ content }) }),
  adminMarkMessageRead: (token: string, id: string) =>
    request<{ message: ContactMessage }>(`/contact/${id}/read`, { method: "PATCH", token }),
  adminDeleteMessage: (token: string, id: string) =>
    request<void>(`/contact/${id}`, { method: "DELETE", token }),

  // Admin
  adminStats: (token: string) => request<{ dailySales: number; dailyOrders: number; totalOrders: number; totalUsers: number; topProducts: Product[] }>("/admin/stats", { token }),
  adminOrders: (token: string) => request<{ orders: Order[] }>("/orders/admin/all", { token }),
  adminUsers: (token: string) => request<{ users: User[] }>("/users", { token }),
  updateOrderStatus: (token: string, id: string, status: string) =>
    request<{ order: Order }>(`/orders/${id}/status`, { method: "PATCH", token, body: JSON.stringify({ status }) }),
  updateUserRole: (token: string, id: string, role: "customer" | "admin") =>
    request<{ user: User }>(`/users/${id}/role`, { method: "PATCH", token, body: JSON.stringify({ role }) }),

  // Admin — menu / products
  adminCreateProduct: (token: string, body: unknown) =>
    request<{ product: Product }>("/products", { method: "POST", token, body: JSON.stringify(body) }),
  adminUpdateProduct: (token: string, id: string, body: unknown) =>
    request<{ product: Product }>(`/products/${id}`, { method: "PUT", token, body: JSON.stringify(body) }),
  adminDeleteProduct: (token: string, id: string) =>
    request<void>(`/products/${id}`, { method: "DELETE", token }),

  // Account — change own login details (requires current password)
  updateCredentials: (token: string, body: { currentPassword: string; name?: string; email?: string; newPassword?: string }) =>
    request<{ token: string; user: User }>("/auth/me", { method: "PATCH", token, body: JSON.stringify(body) })
};
