import { Router } from "express";
import { listUsers, toggleFavorite } from "../controllers/userController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const userRoutes = Router();

userRoutes.get("/", requireAuth, requireAdmin, listUsers);
userRoutes.post("/favorites/:productId", requireAuth, toggleFavorite);

