import crypto from "crypto";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
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
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isAvailable: true } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const items = req.body.items.map((item: { product: string; quantity: number }) => {
    const product = productMap.get(item.product);
    if (!product) throw new ApiError(400, "One or more products are unavailable");
    return { productId: product.id, name: product.name, price: product.price, quantity: item.quantity, image: product.image };
  });

  const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let couponCode: string | undefined;

  if (req.body.couponCode) {
    const coupon = await prisma.coupon.findFirst({ where: { code: String(req.body.couponCode).toUpperCase(), isActive: true } });
    if (!coupon || coupon.expiresAt < new Date() || subtotal < coupon.minOrderAmount) {
      throw new ApiError(400, "Coupon is invalid or not applicable");
    }
    discount = coupon.discountType === "percentage" ? subtotal * (coupon.value / 100) : coupon.value;
    couponCode = coupon.code;
  }

  const deliveryFee = req.body.fulfillment === "delivery" ? getDeliveryFee(req.body.deliveryArea) : 0;
  const total = Math.max(subtotal - discount + deliveryFee, 0);
  const trackingCode = `TCG-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      userId: req.user!.id,
      items: { create: items },
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
    },
    include: { items: true, user: { select: { email: true, phone: true, name: true } } }
  });

  await Promise.all(
    items.map((item: { productId: string; quantity: number }) =>
      prisma.product.update({ where: { id: item.productId }, data: { soldCount: { increment: item.quantity }, stock: { decrement: item.quantity } } })
    )
  );

  const u = (order as unknown as { user: { email: string; phone: string } }).user;
  await sendOrderEmail(u.email, "The Cake Gallery order confirmation", `<p>Your order ${trackingCode} has been received.</p>`);
  await sendOrderSms(u.phone, `The Cake Gallery: your order ${trackingCode} is Pending.`);

  res.status(201).json({ order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ where: { userId: req.user!.id }, include: { items: true }, orderBy: { createdAt: "desc" } });
  res.json({ orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { trackingCode: String(req.params.trackingCode) },
    include: { items: true, user: { select: { id: true, name: true, email: true, phone: true } } }
  }) as ({ id: string; trackingCode: string; items: unknown[]; user: { id: string; name: string; email: string; phone: string } }) | null;
  if (!order) throw new ApiError(404, "Order not found");
  if (req.user?.role !== "admin" && order.user.id !== req.user?.id) throw new ApiError(403, "Forbidden");
  res.json({ order });
});

export const listOrders = asyncHandler(async (_req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true, user: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = z.enum(["Pending", "Preparing", "Out for Delivery", "Delivered"]).parse(req.body.status);
  try {
    const order = await prisma.order.update({
      where: { id: String(req.params.id) },
      data: { status },
      include: { user: { select: { email: true, phone: true } } }
    });
    const u = (order as unknown as { user: { email: string; phone: string } }).user;
    await sendOrderEmail(u.email, "Order status update", `<p>Your order ${order.trackingCode} is now ${status}.</p>`);
    await sendOrderSms(u.phone, `The Cake Gallery: order ${order.trackingCode} is now ${status}.`);
    res.json({ order });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Order not found");
    throw e;
  }
});

export const deliveryAreas = asyncHandler(async (_req, res) => {
  res.json({ areas: listDeliveryAreas() });
});
