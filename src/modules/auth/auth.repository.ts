import { prisma } from "../../lib/prisma.js";

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: {
        email,
      },
    });
  }
}
