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

// Public — only approved reviews
export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: String(req.params.productId), isApproved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json({ reviews });
});

// Public — latest approved reviews (for home page)
export const listApprovedReviews = asyncHandler(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    include: {
      user: { select: { name: true } },
      product: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 9
  });
  res.json({ reviews });
});

// Admin — all reviews pending approval
export const listAllReviews = asyncHandler(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  res.json({ reviews });
});

// Admin — approve or reject a review
export const setReviewApproval = asyncHandler(async (req, res) => {
  const approved = z.boolean().parse(req.body.isApproved);
  try {
    const review = await prisma.review.update({
      where: { id: String(req.params.id) },
      data: { isApproved: approved }
    });
    res.json({ review });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Review not found");
    throw e;
  }
});

export const createReview = asyncHandler(async (req, res) => {
  // Check for duplicate
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId: req.user!.id, productId: req.body.productId } }
  });
  if (existing) throw new ApiError(409, "You have already reviewed this product");

  const review = await prisma.review.create({
    data: { ...req.body, userId: req.user!.id, isApproved: false }
  });

  // Update product rating stats (only from approved reviews)
  const stats = await prisma.review.aggregate({
    where: { productId: review.productId, isApproved: true },
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
