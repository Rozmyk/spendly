import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

const prisma = new PrismaClient();

export default async (fastify: FastifyInstance) => {
  fastify.get("/categories", async () => prisma.category.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true },
  }));
};
