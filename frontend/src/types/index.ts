export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  price: number;
  image: string;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isTodaySpecial: boolean;
  prepTimeMinutes: number;
  stock: number;
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
  tags: string[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  address?: string;
  favorites?: Product[];
};

export type CartItem = Product & { quantity: number };

export type Order = {
  id: string;
  trackingCode: string;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered";
  paymentMethod: "Airtel Money" | "MTN MoMo" | "Cash on Delivery";
  paymentStatus: "pending" | "paid" | "failed";
  fulfillment: "delivery" | "pickup";
  deliveryArea?: string;
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  total: number;
  items: Array<{ id: string; productId: string; name: string; price: number; quantity: number; image: string }>;
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user?: { name: string; email?: string };
  product?: { name: string };
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
