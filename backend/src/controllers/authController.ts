import { z } from "zod";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";
import { signToken } from "../utils/token.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8),
  address: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function authResponse(user: { _id: unknown; name: string; email: string; phone: string; role: "customer" | "admin"; address?: string }) {
  const id = String(user._id);
  const token = signToken({ id, role: user.role });
  return {
    token,
    user: {
      id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address
    }
  };
}

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await User.create({ ...req.body, role: "customer" });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json(authResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?.id).populate("favorites");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
});
