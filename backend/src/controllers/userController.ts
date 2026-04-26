import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";
import mongoose from "mongoose";

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id);
  if (!user) throw new ApiError(404, "User not found");
  const productId = String(req.params.productId);
  const exists = user.favorites.some((id) => String(id) === productId);
  user.favorites = exists ? user.favorites.filter((id) => String(id) !== productId) : [...user.favorites, new mongoose.Types.ObjectId(productId)];
  await user.save();
  await user.populate("favorites");
  res.json({ favorites: user.favorites });
});
