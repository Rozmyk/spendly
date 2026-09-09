import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  fastify.get("/categories", async () => fastify.prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true },
  }));
};
