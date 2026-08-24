import jwt from "jsonwebtoken";
import { env } from "../../env.js";

export const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export interface AccessTokenPayload {
  restaurantId: number;
  userId: number;
}

export interface RefreshTokenPayload {
  tokenId: number;
  userId: number;
}

export function signAccessToken(userId: number, restaurantId: number): string {
  return jwt.sign({ restaurantId, userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 15,
  });
}

export function signRefreshToken(userId: number, tokenId: number): string {
  return jwt.sign({ tokenId, userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(
  accessToken: string
): AccessTokenPayload | null {
  try {
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);

    if (
      typeof decoded === "string" ||
      typeof decoded.restaurantId !== "number" ||
      typeof decoded.userId !== "number"
    ) {
      return null;
    }

    return {
      restaurantId: decoded.restaurantId,
      userId: decoded.userId,
    };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(
  refreshToken: string
): RefreshTokenPayload | null {
  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    if (
      typeof decoded === "string" ||
      typeof decoded.tokenId !== "number" ||
      typeof decoded.userId !== "number"
    ) {
      return null;
    }

    return {
      tokenId: decoded.tokenId,
      userId: decoded.userId,
    };
  } catch {
    return null;
  }
}

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    maxAge: REFRESH_TOKEN_TTL_MS,
    path: "/",
    sameSite: env.NODE_ENV === "PROD" ? ("none" as const) : ("lax" as const),
    secure: env.NODE_ENV === "PROD",
  };
}
