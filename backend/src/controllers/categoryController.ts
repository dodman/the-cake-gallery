import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().url().optional()
});

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  res.json({ categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const category = await prisma.category.update({ where: { id: String(req.params.id) }, data: req.body });
    res.json({ category });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Category not found");
    throw e;
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Category not found");
    throw e;
  }
});
