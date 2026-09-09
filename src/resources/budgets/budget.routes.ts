import { FastifyInstance, FastifyRequest } from "fastify";

import { requireUserId } from "@core/auth/index.js";

type BudgetRequest = FastifyRequest<{ Body: { monthlyLimit: number } }>;

const budgetSchema = {
  response: {
    200: {
      type: "object",
      required: ["monthlyLimit"],
      properties: { monthlyLimit: { type: ["number", "null"] } },
    },
  },
};

export default async (fastify: FastifyInstance) => {
  fastify.get("/budget", { schema: budgetSchema }, async (request, reply) => {
    const userId = await requireUserId(request, reply);
    if (!userId) return;
    const budget = await fastify.prisma.budget.findUnique({ where: { userId }, select: { monthlyLimit: true } });
    return { monthlyLimit: budget ? Number(budget.monthlyLimit) : null };
  });

  fastify.put("/budget", {
    schema: {
      body: {
        type: "object",
        required: ["monthlyLimit"],
        additionalProperties: false,
        properties: { monthlyLimit: { type: "number", minimum: 1, maximum: 100000000 } },
      },
      ...budgetSchema,
    },
  }, async (request: BudgetRequest, reply) => {
    const userId = await requireUserId(request, reply);
    if (!userId) return;
    const budget = await fastify.prisma.budget.upsert({
      where: { userId },
      create: { userId, monthlyLimit: request.body.monthlyLimit },
      update: { monthlyLimit: request.body.monthlyLimit },
      select: { monthlyLimit: true },
    });
    return { monthlyLimit: Number(budget.monthlyLimit) };
  });
};
