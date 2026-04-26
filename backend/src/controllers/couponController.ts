import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const couponSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional().default(0),
  expiresAt: z.coerce.date(),
  isActive: z.boolean().optional().default(true)
});

export const listCoupons = asyncHandler(async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ coupons });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await prisma.coupon.create({ data: { ...req.body, code: String(req.body.code).toUpperCase() } });
  res.status(201).json({ coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: String(req.params.id) }, data: req.body });
    res.json({ coupon });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Coupon not found");
    throw e;
  }
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    await prisma.coupon.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Coupon not found");
    throw e;
  }
});
