import { FastifyInstance, FastifyRequest } from "fastify";

import { requireUserId } from "@core/auth/index.js";

type AccountBody = { name: string; openingBalance?: number };
type IncomeBody = { amount: number; description: string; receivedAt?: string };

const accountBody = { type: "object", required: ["name"], additionalProperties: false, properties: { name: { type: "string", minLength: 1, maxLength: 120 }, openingBalance: { type: "number", minimum: -100000000, maximum: 100000000 } } };
const incomeBody = { type: "object", required: ["amount", "description"], additionalProperties: false, properties: { amount: { type: "number", minimum: 0.01, maximum: 100000000 }, description: { type: "string", minLength: 1, maxLength: 500 }, receivedAt: { type: "string", format: "date-time" } } };

export default async (fastify: FastifyInstance) => {
  fastify.get("/accounts", async (request, reply) => {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const accounts = await fastify.prisma.walletAccount.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
    return accounts.map((account) => ({ ...account, openingBalance: Number(account.openingBalance) }));
  });

  fastify.post<{ Body: AccountBody }>("/accounts", { schema: { body: accountBody } }, async (request: FastifyRequest<{ Body: AccountBody }>, reply) => {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const account = await fastify.prisma.walletAccount.create({ data: { userId, name: request.body.name.trim(), openingBalance: request.body.openingBalance ?? 0 } });
    return reply.code(201).send({ ...account, openingBalance: Number(account.openingBalance) });
  });

  fastify.get("/incomes", async (request, reply) => {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const incomes = await fastify.prisma.income.findMany({ where: { userId }, orderBy: { receivedAt: "desc" } });
    return incomes.map((income) => ({ ...income, amount: Number(income.amount) }));
  });

  fastify.post<{ Body: IncomeBody }>("/incomes", { schema: { body: incomeBody } }, async (request: FastifyRequest<{ Body: IncomeBody }>, reply) => {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const income = await fastify.prisma.income.create({ data: { userId, amount: request.body.amount, description: request.body.description.trim(), receivedAt: request.body.receivedAt ? new Date(request.body.receivedAt) : undefined } });
    return reply.code(201).send({ ...income, amount: Number(income.amount) });
  });

  fastify.get("/financial-summary", async (request, reply) => {
    const userId = await requireUserId(request, reply); if (!userId) return;
    const [income, expenses, accounts] = await Promise.all([
      fastify.prisma.income.aggregate({ where: { userId }, _sum: { amount: true } }),
      fastify.prisma.expense.aggregate({ where: { userId }, _sum: { amount: true } }),
      fastify.prisma.walletAccount.aggregate({ where: { userId }, _sum: { openingBalance: true } }),
    ]);
    const openingBalance = Number(accounts._sum.openingBalance ?? 0);
    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);
    return { openingBalance, totalIncome, totalExpenses, balance: openingBalance + totalIncome - totalExpenses };
  });
};
