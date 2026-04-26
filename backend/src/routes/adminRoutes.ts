import { Router } from "express";
import { dashboardStats } from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const adminRoutes = Router();

adminRoutes.get("/stats", requireAuth, requireAdmin, dashboardStats);

