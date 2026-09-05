import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class Create {
  public constructor(
    private request: FastifyRequest<Api.Schemas.Expenses.Create.Request>,
    private reply: FastifyReply,
    private fastify: FastifyInstance,
  ) {}

  public async handle() {
    const expense = await this.fastify.resources.expenses.repositories.expenseRepository.create(this.request.body);

    return this.reply.code(201).send({
      ...expense,
    });
  }
}
