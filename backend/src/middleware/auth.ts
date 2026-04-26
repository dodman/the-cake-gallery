import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/errors.js";
import { verifyToken } from "../utils/token.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return next(new ApiError(401, "Authentication required"));

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return next(new ApiError(403, "Admin access required"));
  next();
}

