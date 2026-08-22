import { prisma } from "../../lib/prisma.js";

export class RestaurantRepository {
  async findBySlug(slug: string) {
    return await prisma.restaurant.findUnique({ where: { slug } });
  }
}
