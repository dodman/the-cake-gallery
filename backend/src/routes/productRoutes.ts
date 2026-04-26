import { Router } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, productSchema, updateProduct } from "../controllers/productController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const productRoutes = Router();

productRoutes.get("/", listProducts);
productRoutes.get("/:slug", getProduct);
productRoutes.post("/", requireAuth, requireAdmin, validate(productSchema), createProduct);
productRoutes.put("/:id", requireAuth, requireAdmin, validate(productSchema.partial()), updateProduct);
productRoutes.delete("/:id", requireAuth, requireAdmin, deleteProduct);

