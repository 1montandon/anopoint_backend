import jwt from "jsonwebtoken";
import { env } from "../../env.js";
import type { RefreshTokenPayload } from "./auth.schema.js";

export function signAccessToken(userId: number, restaurantId: number) {
  return jwt.sign({ restaurantId, sub: userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 15,
  });
}

export function signRefreshToken(userId: string, tokenId: string) {
  return jwt.sign({ tokenId, userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyRefreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    return decoded as RefreshTokenPayload;
  } catch {
    return null;
  }
}

export function getRefreshTokenCookieOptions() {
  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: env.NODE_ENV === "PROD" ? ("none" as const) : ("lax" as const),
    secure: env.NODE_ENV === "PROD",
  };
}
