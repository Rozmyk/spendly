import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  /**
   * Create an expense
   *
   * @function
   * @name POST /expenses
   */
  fastify.post("/expenses", fastify.resources.expenses.schemas.create, async function (_request, reply) {
    return reply.code(204).send();
  });
};
