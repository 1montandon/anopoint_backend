import { prisma } from "../../lib/prisma.js";

export class LanchoneteRepository {
  async findBySlug(slug: string) {
    return await prisma.lanchonete.findUnique({ where: { slug } });
  }
}
