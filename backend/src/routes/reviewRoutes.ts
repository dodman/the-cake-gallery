import { Router } from "express";
import {
  createReview,
  deleteReview,
  listApprovedReviews,
  listReviews,
  reviewSchema,
  setReviewApproval,
  listAllReviews
} from "../controllers/reviewController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const reviewRoutes = Router();

reviewRoutes.get("/approved", listApprovedReviews);            // public — home page feed
reviewRoutes.get("/admin/all", requireAuth, requireAdmin, listAllReviews); // admin
reviewRoutes.patch("/:id/approve", requireAuth, requireAdmin, setReviewApproval); // admin
reviewRoutes.get("/:productId", listReviews);                  // public — product page
reviewRoutes.post("/", requireAuth, validate(reviewSchema), createReview);
reviewRoutes.delete("/:id", requireAuth, deleteReview);
