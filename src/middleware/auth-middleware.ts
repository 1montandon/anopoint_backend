import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../env.js";
import HttpError from "../error/error.js";

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
  try {
    const JWT_SECRET = env.ACCESS_TOKEN_SECRET;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(decoded);
    req.userId = decoded.userId;
    req.restaurantId = decoded.restaurantId;
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}
