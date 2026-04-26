import { Router } from "express";
import { createReview, deleteReview, listReviews, reviewSchema } from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const reviewRoutes = Router();

reviewRoutes.get("/:productId", listReviews);
reviewRoutes.post("/", requireAuth, validate(reviewSchema), createReview);
reviewRoutes.delete("/:id", requireAuth, deleteReview);

