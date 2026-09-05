import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  /**
   * Route handler for the expense endpoint.
   *
   * @function
   * @name POST /expenses
   */
  fastify.post(
    "/expenses",
    fastify.resources.expenses.schemas.root,
    async function (request, reply) {
      reply.code(204).send();
    }
  );
};