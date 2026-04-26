import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5)
});

// Public — submit a message
export const createMessage = asyncHandler(async (req, res) => {
  const message = await prisma.contactMessage.create({
    data: { name: req.body.name, email: req.body.email, message: req.body.message }
  });
  res.status(201).json({ message });
});

// Admin — list all messages
export const listMessages = asyncHandler(async (_req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json({ messages });
});

// Admin — mark message as read
export const markMessageRead = asyncHandler(async (req, res) => {
  const msg = await prisma.contactMessage.findUnique({ where: { id: String(req.params.id) } });
  if (!msg) throw new ApiError(404, "Message not found");
  const updated = await prisma.contactMessage.update({
    where: { id: String(req.params.id) },
    data: { isRead: true }
  });
  res.json({ message: updated });
});

// Admin — delete message
export const deleteMessage = asyncHandler(async (req, res) => {
  const msg = await prisma.contactMessage.findUnique({ where: { id: String(req.params.id) } });
  if (!msg) throw new ApiError(404, "Message not found");
  await prisma.contactMessage.delete({ where: { id: String(req.params.id) } });
  res.status(204).send();
});
