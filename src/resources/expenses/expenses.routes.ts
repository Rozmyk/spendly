import { FastifyInstance } from "fastify";
import { requireUserId } from "@core/auth/index.js";

const params = { type: "object", required: ["id"], properties: { id: { type: "string", pattern: "^[1-9][0-9]*$" } } };

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

  fastify.get<{ Params: { id: string } }>("/expenses/:id", { schema: { params } }, async function (request, reply) {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const expense = await this.resources.expenses.repositories.expenseRepository.findById(this.prisma, Number(request.params.id), userId);
    return expense ? reply.send(expense) : reply.code(404).send({ message: "Expense not found." });
  });

  fastify.patch<{ Params: { id: string }; Body: { amount?: number; description?: string; categoryId?: number } }>("/expenses/:id", { schema: { params, body: { type: "object", minProperties: 1, additionalProperties: false, properties: { amount: { type: "number", minimum: 0.01 }, description: { type: "string", minLength: 1 }, categoryId: { type: "integer", minimum: 1 } } } } }, async function (request, reply) {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const expense = await this.resources.expenses.repositories.expenseRepository.update(this.prisma, Number(request.params.id), userId, request.body);
    return expense ? reply.send(expense) : reply.code(404).send({ message: "Expense not found." });
  });

  fastify.delete<{ Params: { id: string } }>("/expenses/:id", { schema: { params } }, async function (request, reply) {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const deleted = await this.resources.expenses.repositories.expenseRepository.delete(this.prisma, Number(request.params.id), userId);
    return deleted ? reply.code(204).send() : reply.code(404).send({ message: "Expense not found." });
  });
};
