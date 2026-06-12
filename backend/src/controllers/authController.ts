import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
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

function authResponse(user: { id: string; name: string; email: string; phone: string; role: string; address?: string | null }) {
  const token = signToken({ id: user.id, role: user.role as "customer" | "admin" });
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, address: user.address }
  };
}

export const register = asyncHandler(async (req, res) => {
  const existing = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase().trim() } });
  if (existing) throw new ApiError(409, "Email is already registered");

  const password = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({
    data: { name: req.body.name, email: req.body.email.toLowerCase().trim(), phone: req.body.phone, password, address: req.body.address, role: "customer" }
  });
  res.status(201).json(authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email.toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  res.json(authResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    include: { favorites: { include: { product: true } } }
  });
  if (!user) throw new ApiError(404, "User not found");
  const { password: _pw, ...safe } = user;
  res.json({ user: { ...safe, favorites: user.favorites.map((f) => f.product) } });
});

export const updateCredentialsSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    newPassword: z.string().min(8).optional()
  })
  .refine((data) => data.name || data.email || data.newPassword, {
    message: "Provide a new name, email or password to update"
  });

export const updateCredentials = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
  if (!user) throw new ApiError(404, "User not found");

  const valid = await bcrypt.compare(req.body.currentPassword, user.password);
  if (!valid) throw new ApiError(401, "Current password is incorrect");

  const data: { name?: string; email?: string; password?: string } = {};

  if (req.body.name) data.name = req.body.name.trim();

  if (req.body.email) {
    const email = req.body.email.toLowerCase().trim();
    if (email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new ApiError(409, "That email is already in use");
      data.email = email;
    }
  }

  if (req.body.newPassword) data.password = await bcrypt.hash(req.body.newPassword, 12);

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  res.json(authResponse(updated));
});
