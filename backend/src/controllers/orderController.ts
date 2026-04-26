import crypto from "crypto";
import { z } from "zod";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";
import { sendOrderEmail, sendOrderSms } from "../utils/notify.js";
import { getDeliveryFee, listDeliveryAreas } from "../services/delivery.js";

export const orderSchema = z.object({
  items: z.array(z.object({ product: z.string(), quantity: z.number().int().positive() })).min(1),
  paymentMethod: z.enum(["Airtel Money", "MTN MoMo", "Cash on Delivery"]),
  fulfillment: z.enum(["delivery", "pickup"]),
  deliveryArea: z.string().optional(),
  deliveryAddress: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

export const createOrder = asyncHandler(async (req, res) => {
  const productIds = req.body.items.map((item: { product: string }) => item.product);
  const products = await Product.find({ _id: { $in: productIds }, isAvailable: true });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const items = req.body.items.map((item: { product: string; quantity: number }) => {
    const product = productMap.get(item.product);
    if (!product) throw new ApiError(400, "One or more products are unavailable");
    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image
    };
  });

  const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let couponCode: string | undefined;

  if (req.body.couponCode) {
    const coupon = await Coupon.findOne({ code: String(req.body.couponCode).toUpperCase(), isActive: true });
    if (!coupon || coupon.expiresAt < new Date() || subtotal < coupon.minOrderAmount) {
      throw new ApiError(400, "Coupon is invalid or not applicable");
    }
    discount = coupon.discountType === "percentage" ? subtotal * (coupon.value / 100) : coupon.value;
    couponCode = coupon.code;
  }

  const deliveryFee = req.body.fulfillment === "delivery" ? getDeliveryFee(req.body.deliveryArea) : 0;
  const total = Math.max(subtotal - discount + deliveryFee, 0);
  const trackingCode = `SBK-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  const order = await Order.create({
    user: req.user?.id,
    items,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: req.body.paymentMethod === "Cash on Delivery" ? "pending" : "paid",
    fulfillment: req.body.fulfillment,
    deliveryArea: req.body.deliveryArea,
    deliveryAddress: req.body.deliveryAddress,
    deliveryFee,
    subtotal,
    discount,
    total,
    couponCode,
    notes: req.body.notes,
    trackingCode
  });

  await Product.bulkWrite(
    items.map((item: { product: unknown; quantity: number }) => ({
      updateOne: { filter: { _id: item.product }, update: { $inc: { soldCount: item.quantity, stock: -item.quantity } } }
    }))
  );

  const user = await order.populate<{ user: { email: string; phone: string; name: string } }>("user", "email phone name");
  await sendOrderEmail(user.user.email, "The Cake Gallery order confirmation", `<p>Your order ${trackingCode} has been received.</p>`);
  await sendOrderSms(user.user.phone, `The Cake Gallery: your order ${trackingCode} is Pending.`);

  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user?.id }).sort({ createdAt: -1 });
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ trackingCode: req.params.trackingCode }).populate("user", "name email phone");
  if (!order) throw new ApiError(404, "Order not found");
  if (req.user?.role !== "admin" && String(order.user._id) !== req.user?.id) throw new ApiError(403, "Forbidden");
  res.json({ order });
});

export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate("user", "name email phone").sort({ createdAt: -1 });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = z.enum(["Pending", "Preparing", "Out for Delivery", "Delivered"]).parse(req.body.status);
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("user", "email phone");
  if (!order) throw new ApiError(404, "Order not found");
  const user = order.user as unknown as { email: string; phone: string };
  await sendOrderEmail(user.email, "Order status update", `<p>Your order ${order.trackingCode} is now ${status}.</p>`);
  await sendOrderSms(user.phone, `The Cake Gallery: order ${order.trackingCode} is now ${status}.`);
  res.json({ order });
});

export const deliveryAreas = asyncHandler(async (_req, res) => {
  res.json({ areas: listDeliveryAreas() });
});

