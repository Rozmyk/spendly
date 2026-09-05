import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {

  /**
   * Route handler for the root endpoint ("/").
   *
   * @function
   * @name GET /
   */
  fastify.get("/", fastify.resources.core.schemas.root, async function (request, reply) {
    return reply.code(204).send();
  });

  /**
   * Health check endpoint. It does not access external services, so it
   * confirms that the Fastify server itself is running and can serve requests.
   *
   * @function
   * @name GET /health
   */
  fastify.get("/health", async function (_request, reply) {
    return reply.code(200).send({ status: "ok" });
  });
};
