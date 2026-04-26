import { Router } from "express";
import { createOrder, deliveryAreas, getOrder, listOrders, myOrders, orderSchema, updateOrderStatus } from "../controllers/orderController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const orderRoutes = Router();

orderRoutes.get("/delivery-areas", deliveryAreas);
orderRoutes.post("/", requireAuth, validate(orderSchema), createOrder);
orderRoutes.get("/mine", requireAuth, myOrders);
orderRoutes.get("/admin/all", requireAuth, requireAdmin, listOrders);
orderRoutes.get("/:trackingCode", requireAuth, getOrder);
orderRoutes.patch("/:id/status", requireAuth, requireAdmin, updateOrderStatus);

