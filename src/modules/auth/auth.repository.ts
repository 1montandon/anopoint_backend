import { prisma } from "../../lib/prisma.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
