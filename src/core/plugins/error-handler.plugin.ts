import { Prisma } from "@prisma/client";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

export const errorHandler: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error, _request, reply) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return reply.code(409).send({ statusCode: 409, error: "Conflict", message: "A resource with this value already exists." });
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    const message = statusCode >= 500 ? "Internal server error." : error.message;
    return reply.code(statusCode).send({ statusCode, error: statusCode >= 500 ? "Internal Server Error" : error.name, message });
  });
});
