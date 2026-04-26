import mongoose, { Schema } from "mongoose";

export type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Delivered";
export type PaymentMethod = "Airtel Money" | "MTN MoMo" | "Cash on Delivery";
export type Fulfillment = "delivery" | "pickup";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true }
  },
  { _id: false }
);

export interface IOrder {
  user: mongoose.Types.ObjectId;
  items: Array<{
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed";
  fulfillment: Fulfillment;
  deliveryArea?: string;
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  trackingCode: string;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Out for Delivery", "Delivered"],
      default: "Pending"
    },
    paymentMethod: {
      type: String,
      enum: ["Airtel Money", "MTN MoMo", "Cash on Delivery"],
      required: true
    },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    fulfillment: { type: String, enum: ["delivery", "pickup"], required: true },
    deliveryArea: String,
    deliveryAddress: String,
    deliveryFee: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: String,
    notes: String,
    trackingCode: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);

