import { FastifyInstance, FastifyReply } from "fastify";

export class List {
  public constructor(
    private reply: FastifyReply,
    private fastify: FastifyInstance,
  ) {}

  public async handle() {
    const expenses = await this.fastify.resources.expenses.repositories.expenseRepository.findAll();

    return this.reply.send(expenses);
  }
}
