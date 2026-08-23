import { prisma } from "../../lib/prisma.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createRefreshToken(
    userId: number,
    expiresAt: Date,
    ipAddress?: string,
    userAgent?: string
  ) {
    return await prisma.refreshToken.create({
      data: { expiresAt, ipAddress, userAgent, userId },
    });
  }
}
