import { FastifyInstance, FastifyRequest } from "fastify";

import { requireUserId } from "@core/auth/index.js";

type MonthlyQuery = { month?: string };

const querystring = {
  type: "object",
  additionalProperties: false,
  properties: { month: { type: "string", pattern: "^[0-9]{4}-(0[1-9]|1[0-2])$" } },
};

const response = {
  200: {
    type: "object",
    required: ["month", "total", "count", "budget", "remaining", "byCategory"],
    properties: {
      month: { type: "string" },
      total: { type: "number" },
      count: { type: "integer" },
      budget: { type: ["number", "null"] },
      remaining: { type: ["number", "null"] },
      byCategory: {
        type: "array",
        items: {
          type: "object",
          required: ["categoryId", "name", "total", "count"],
          properties: {
            categoryId: { type: "integer" },
            name: { type: "string" },
            total: { type: "number" },
            count: { type: "integer" },
          },
        },
      },
    },
  },
};

function monthRange(month: string) {
  const [year, value] = month.split("-").map(Number);
  return {
    from: new Date(Date.UTC(year, value - 1, 1)),
    to: new Date(Date.UTC(year, value, 1)),
  };
}

export default async (fastify: FastifyInstance) => {
  fastify.get<{ Querystring: MonthlyQuery }>("/reports/monthly", { schema: { querystring, response } }, async (request: FastifyRequest<{ Querystring: MonthlyQuery }>, reply) => {
    const userId = await requireUserId(request, reply);
    if (!userId) return;

    const month = request.query.month ?? new Date().toISOString().slice(0, 7);
    const { from, to } = monthRange(month);
    const where = { userId, createdAt: { gte: from, lt: to } };
    const [summary, grouped, budget] = await Promise.all([
      fastify.prisma.expense.aggregate({ where, _sum: { amount: true }, _count: true }),
      fastify.prisma.expense.groupBy({ where, by: ["categoryId"], _sum: { amount: true }, _count: true, orderBy: { _sum: { amount: "desc" } } }),
      fastify.prisma.budget.findUnique({ where: { userId }, select: { monthlyLimit: true } }),
    ]);
    const categories = await fastify.prisma.category.findMany({
      where: { id: { in: grouped.map((entry) => entry.categoryId) } },
      select: { id: true, name: true },
    });
    const names = new Map(categories.map((category) => [category.id, category.name]));
    const total = Number(summary._sum.amount ?? 0);
    const limit = budget ? Number(budget.monthlyLimit) : null;

    return {
      month,
      total,
      count: summary._count,
      budget: limit,
      remaining: limit === null ? null : limit - total,
      byCategory: grouped.map((entry) => ({
        categoryId: entry.categoryId,
        name: names.get(entry.categoryId) ?? "Uncategorized",
        total: Number(entry._sum.amount ?? 0),
        count: entry._count,
      })),
    };
  });
};
