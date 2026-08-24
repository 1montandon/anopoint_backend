import { prisma } from "../../lib/prisma.js";

interface CreateRefreshTokenInput {
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: number;
}

interface RotateRefreshTokenInput extends CreateRefreshTokenInput {
  tokenId: number;
}

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createRefreshToken({
    expiresAt,
    ipAddress,
    userAgent,
    userId,
  }: CreateRefreshTokenInput) {
    return await prisma.refreshToken.create({
      data: { expiresAt, ipAddress, userAgent, userId },
    });
  }

  async findById(id: number) {
    return await prisma.user.findUnique({
      select: {
        active: true,
        createdAt: true,
        email: true,
        id: true,
        name: true,
        restaurantId: true,
        updatedAt: true,
      },
      where: { id },
    });
  }

  async findRefreshTokenById(id: number) {
    return await prisma.refreshToken.findUnique({
      select: {
        expiresAt: true,
        id: true,
        revokedAt: true,
        user: {
          select: {
            active: true,
            id: true,
            restaurantId: true,
          },
        },
        userId: true,
      },
      where: { id },
    });
  }

  async revokeRefreshToken(id: number, userId: number) {
    return await prisma.refreshToken.updateMany({
      data: { revokedAt: new Date() },
      where: { id, revokedAt: null, userId },
    });
  }

  async rotateRefreshToken({
    expiresAt,
    ipAddress,
    tokenId,
    userAgent,
    userId,
  }: RotateRefreshTokenInput) {
    return await prisma.$transaction(async (transaction) => {
      const revokedToken = await transaction.refreshToken.updateMany({
        data: { revokedAt: new Date() },
        where: {
          expiresAt: { gt: new Date() },
          id: tokenId,
          revokedAt: null,
          userId,
        },
      });

      if (revokedToken.count === 0) {
        return null;
      }

      return await transaction.refreshToken.create({
        data: { expiresAt, ipAddress, userAgent, userId },
      });
    });
  }
}
