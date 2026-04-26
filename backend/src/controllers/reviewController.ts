import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3)
});

export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: String(req.params.productId) },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.create({ data: { ...req.body, userId: req.user!.id } });

  const stats = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
    _count: { id: true }
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: { ratingAverage: stats._avg.rating ?? 0, ratingCount: stats._count.id }
  });

  res.status(201).json({ review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: String(req.params.id) } });
  if (!review) throw new ApiError(404, "Review not found");
  if (req.user?.role !== "admin" && review.userId !== req.user?.id) throw new ApiError(403, "Forbidden");

  try {
    await prisma.review.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Review not found");
    throw e;
  }
});
