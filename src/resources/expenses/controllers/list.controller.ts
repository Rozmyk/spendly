import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { requireUserId } from "@core/auth/index.js";

type ListQuery = {
  page?: number;
  limit?: number;
  categoryId?: number;
  from?: string;
  to?: string;
  minAmount?: number;
  maxAmount?: number;
  sort?: "asc" | "desc";
};

export class List {
  public constructor(
    private request: FastifyRequest<{ Querystring: ListQuery }>,
    private reply: FastifyReply,
    private fastify: FastifyInstance,
  ) {}

  public async handle() {
    const userId = await requireUserId(this.request, this.reply);
    if (!userId) return;
    const query = this.request.query;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const { expenses, total } = await this.fastify.resources.expenses.repositories.expenseRepository.findAll(this.fastify.prisma, userId, {
      page,
      limit,
      categoryId: query.categoryId,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
      minAmount: query.minAmount,
      maxAmount: query.maxAmount,
      sort: query.sort ?? "desc",
    });

    this.reply.header("X-Page", page).header("X-Page-Size", limit).header("X-Total-Count", total);
    return this.reply.send(expenses);
  }
}
