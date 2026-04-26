import { Router } from "express";
import { categorySchema, createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categoryController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", requireAuth, requireAdmin, validate(categorySchema), createCategory);
categoryRoutes.put("/:id", requireAuth, requireAdmin, validate(categorySchema.partial()), updateCategory);
categoryRoutes.delete("/:id", requireAuth, requireAdmin, deleteCategory);

