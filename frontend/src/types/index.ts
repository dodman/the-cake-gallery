export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export type Product = {
  _id: string;
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
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  address?: string;
  favorites?: Product[];
};

export type CartItem = Product & { quantity: number };

export type Order = {
  _id: string;
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
  items: Array<{ product: string; name: string; price: number; quantity: number; image: string }>;
  createdAt: string;
};

