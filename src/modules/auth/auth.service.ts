import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import HttpError from "../../error/error.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schema.js";
import {
  REFRESH_TOKEN_TTL_MS,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./auth.token.js";

export interface PublicUser {
  active: boolean;
  createdAt: Date;
  email: string;
  id: number;
  name: string;
  restaurantId: number;
  updatedAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult extends TokenPair {
  user: PublicUser;
}

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
  }

  async login(
    { email, password }: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResult> {
    const user = await this.authRepository.findByEmail(email);

    if (!user?.active) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const accessToken = signAccessToken(user.id, user.restaurantId);
    const createdRefreshToken = await this.authRepository.createRefreshToken({
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      ipAddress,
      userAgent,
      userId: user.id,
    });
    const refreshToken = signRefreshToken(user.id, createdRefreshToken.id);

    return {
      accessToken,
      refreshToken,
      user: {
        active: user.active,
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        name: user.name,
        restaurantId: user.restaurantId,
        updatedAt: user.updatedAt,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return;
    }

    await this.authRepository.revokeRefreshToken(
      payload.tokenId,
      payload.userId
    );
  }

  async refresh(
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<TokenPair> {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const storedToken = await this.authRepository.findRefreshTokenById(
      payload.tokenId
    );

    const isInvalidStoredToken =
      !storedToken ||
      storedToken.userId !== payload.userId ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt <= new Date() ||
      !storedToken.user.active;

    if (isInvalidStoredToken) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const createdRefreshToken = await this.authRepository.rotateRefreshToken({
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      ipAddress,
      tokenId: storedToken.id,
      userAgent,
      userId: storedToken.userId,
    });

    if (!createdRefreshToken) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    return {
      accessToken: signAccessToken(
        storedToken.user.id,
        storedToken.user.restaurantId
      ),
      refreshToken: signRefreshToken(
        storedToken.user.id,
        createdRefreshToken.id
      ),
    };
  }

  async getMe(userId: number): Promise<PublicUser> {
    const user = await this.authRepository.findById(userId);

    if (!user?.active) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    return user;
  }
}
