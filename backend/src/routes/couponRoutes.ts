import { Router } from "express";
import { couponSchema, createCoupon, deleteCoupon, listCoupons, updateCoupon } from "../controllers/couponController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const couponRoutes = Router();

couponRoutes.get("/", requireAuth, requireAdmin, listCoupons);
couponRoutes.post("/", requireAuth, requireAdmin, validate(couponSchema), createCoupon);
couponRoutes.put("/:id", requireAuth, requireAdmin, validate(couponSchema.partial()), updateCoupon);
couponRoutes.delete("/:id", requireAuth, requireAdmin, deleteCoupon);

