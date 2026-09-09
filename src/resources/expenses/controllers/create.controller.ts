import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Prisma } from "@prisma/client";
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
    const idempotencyKey = this.request.headers["idempotency-key"];
    if (typeof idempotencyKey === "string") {
      try {
        await this.fastify.prisma.idempotencyKey.create({ data: { userId, key: idempotencyKey } });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") throw error;
        const existing = await this.fastify.prisma.idempotencyKey.findUnique({ where: { userId_key: { userId, key: idempotencyKey } } });
        if (!existing || existing.statusCode === 0 || !existing.response) return this.reply.code(409).send({ message: "The request is already being processed." });
        return this.reply.code(existing.statusCode).send(existing.response);
      }
    }
    const expense = await this.fastify.resources.expenses.repositories.expenseRepository.create(this.fastify.prisma, this.request.body, userId);

    if (typeof idempotencyKey === "string") await this.fastify.prisma.idempotencyKey.update({ where: { userId_key: { userId, key: idempotencyKey } }, data: { statusCode: 201, response: { ...expense, createdAt: expense.createdAt.toISOString(), updatedAt: expense.updatedAt.toISOString() } } });

    return this.reply.code(201).send({
      ...expense,
    });
  }
}
