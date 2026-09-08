import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireUserId } from "@core/auth/index.js";

export class Create {
  public constructor(
    private request: FastifyRequest<Api.Schemas.Expenses.Create.Request>,
    private reply: FastifyReply,
    private fastify: FastifyInstance,
  ) {}

  public async handle() {
    const userId = await requireUserId(this.request, this.reply);
    if (!userId) return;
    const expense = await this.fastify.resources.expenses.repositories.expenseRepository.create(this.request.body, userId);

    return this.reply.code(201).send({
      ...expense,
    });
  }
}
