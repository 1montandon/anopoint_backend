import type { NextFunction, Request, Response } from "express";
import HttpError from "../error/error.js";
import { verifyAccessToken } from "../modules/auth/auth.token.js";

export interface AuthRequest extends Request {
  restaurantId?: number;
  userId?: number;
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new HttpError(401, "No token provided"));
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return next(new HttpError(401, "Invalid token"));
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return next(new HttpError(401, "Invalid token"));
  }

  req.userId = payload.userId;
  req.restaurantId = payload.restaurantId;
  next();
}
