import { Router } from "express";
import { contactSchema, createMessage, deleteMessage, listMessages, markMessageRead } from "../controllers/contactController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const contactRoutes = Router();

contactRoutes.post("/", validate(contactSchema), createMessage);              // public
contactRoutes.get("/", requireAuth, requireAdmin, listMessages);              // admin
contactRoutes.patch("/:id/read", requireAuth, requireAdmin, markMessageRead); // admin
contactRoutes.delete("/:id", requireAuth, requireAdmin, deleteMessage);       // admin
