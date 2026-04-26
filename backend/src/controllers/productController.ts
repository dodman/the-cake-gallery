import { z } from "zod";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
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
  const filter: Record<string, unknown> = {};

  if (category) {
    const found = await Category.findOne({ slug: String(category) });
    filter.category = found?._id;
  }
  if (featured === "true") filter.isFeatured = true;
  if (specials === "true") filter.isTodaySpecial = true;
  if (search) filter.$text = { $search: String(search) };

  const products = await Product.find(filter).populate("category").sort({ isFeatured: -1, createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("category");
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.status(204).send();
});

