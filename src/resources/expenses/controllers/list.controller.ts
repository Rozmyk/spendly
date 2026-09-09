import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireUserId } from "@core/auth/index.js";

export class List {
  public constructor(
    private request: FastifyRequest,
    private reply: FastifyReply,
    private fastify: FastifyInstance,
  ) {}

  public async handle() {
    const userId = await requireUserId(this.request, this.reply);
    if (!userId) return;
    const expenses = await this.fastify.resources.expenses.repositories.expenseRepository.findAll(this.fastify.prisma, userId);

    return this.reply.send(expenses);
  }
}
