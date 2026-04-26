import { z } from "zod";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const reviewSchema = z.object({
  product: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3)
});

export const listReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user", "name").sort({ createdAt: -1 });
  res.json({ reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user?.id });
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: "$product", average: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  await Product.findByIdAndUpdate(review.product, {
    ratingAverage: stats[0]?.average ?? 0,
    ratingCount: stats[0]?.count ?? 0
  });
  res.status(201).json({ review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");
  if (req.user?.role !== "admin" && String(review.user) !== req.user?.id) throw new ApiError(403, "Forbidden");
  await review.deleteOne();
  res.status(204).send();
});

