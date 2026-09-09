import { PrismaClient } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { prisma } from "@core/database/prisma.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prismaPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate("prisma", prisma);
  fastify.addHook("onClose", async () => prisma.$disconnect());
});
