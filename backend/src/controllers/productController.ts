import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  categoryId: z.string(),
  price: z.number().nonnegative(),
  image: z.string().url(),
  images: z.array(z.string().url()).optional().default([]),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isTodaySpecial: z.boolean().optional().default(false),
  prepTimeMinutes: z.number().int().positive().optional().default(30),
  stock: z.number().int().nonnegative().optional().default(100),
  tags: z.array(z.string()).optional().default([])
});

export const listProducts = asyncHandler(async (req, res) => {
  const { category, search, featured, specials } = req.query;
  const where: Prisma.ProductWhereInput = {};

  if (category) {
    const found = await prisma.category.findUnique({ where: { slug: String(category) } });
    where.categoryId = found?.id;
  }
  if (featured === "true") where.isFeatured = true;
  if (specials === "true") where.isTodaySpecial = true;
  if (search) {
    const term = String(search);
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } }
    ];
  }

  const products = await prisma.product.findMany({ where, include: { category: true }, orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }] });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { slug: String(req.params.slug) }, include: { category: true } });
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.create({ data: req.body, include: { category: true } });
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await prisma.product.update({ where: { id: String(req.params.id) }, data: req.body, include: { category: true } });
    res.json({ product });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Product not found");
    throw e;
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") throw new ApiError(404, "Product not found");
    throw e;
  }
});
