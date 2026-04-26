import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, role: true, address: true, createdAt: true }
  });
  res.json({ users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const role = z.enum(["customer", "admin"]).parse(req.body.role);
  const targetId = String(req.params.id);
  if (targetId === req.user!.id) throw new ApiError(400, "Cannot change your own role");
  const user = await prisma.user.update({
    where: { id: targetId },
    data: { role },
    select: { id: true, name: true, email: true, role: true }
  });
  res.json({ user });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiError(401, "Authentication required");
  const productId = String(req.params["productId"]);

  const existing = await prisma.userFavorite.findUnique({
    where: { userId_productId: { userId, productId } }
  });

  if (existing) {
    await prisma.userFavorite.delete({ where: { userId_productId: { userId, productId } } });
  } else {
    await prisma.userFavorite.create({ data: { userId, productId } });
  }

  const favorites = await prisma.userFavorite.findMany({ where: { userId }, include: { product: true } });
  res.json({ favorites: favorites.map((f) => f.product) });
});
