import { Router } from "express";
import { listUsers, toggleFavorite, updateUserRole } from "../controllers/userController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const userRoutes = Router();

userRoutes.get("/", requireAuth, requireAdmin, listUsers);
userRoutes.patch("/:id/role", requireAuth, requireAdmin, updateUserRole);
userRoutes.post("/favorites/:productId", requireAuth, toggleFavorite);
