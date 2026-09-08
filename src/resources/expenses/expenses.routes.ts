import { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance) => {
  /**
   * Create an expense
   *
   * @function
   * @name POST /expenses
   */
  fastify.post<Api.Schemas.Expenses.Create.Request>("/expenses", fastify.resources.expenses.schemas.create, async function (request, reply) {
    return new fastify.resources.expenses.controllers.Create(request, reply, this).handle();
  });

  /**
   * List saved expenses.
   *
   * @function
   * @name GET /expenses
   */
  fastify.get("/expenses", fastify.resources.expenses.schemas.list, async function (request, reply) {
    return new fastify.resources.expenses.controllers.List(request, reply, this).handle();
  });
};
