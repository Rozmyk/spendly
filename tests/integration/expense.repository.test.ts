import { randomUUID } from "crypto";

import { prisma } from "@core/database/prisma.js";
import { expenseRepository } from "@resources/expenses/repositories/index.js";

const describeIntegration = process.env.RUN_INTEGRATION_TESTS === "true" ? describe : describe.skip;

describeIntegration("ExpenseRepository", () => {
  const userId = randomUUID();

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.create({ data: { id: userId, email: `${userId}@example.test`, name: "Integration Test" } });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
  });

  test("stores and filters user-owned expenses", async () => {
    await expenseRepository.create(prisma, { amount: 42.5, description: "Lunch", categoryId: 1 }, userId);
    await expenseRepository.create(prisma, { amount: 120, description: "Train", categoryId: 3 }, userId);

    const result = await expenseRepository.findAll(prisma, userId, {
      page: 1,
      limit: 20,
      categoryId: 1,
      minAmount: 40,
      sort: "desc",
    });

    expect(result.total).toBe(1);
    expect(result.expenses).toEqual([expect.objectContaining({ amount: 42.5, categoryId: 1, description: "Lunch" })]);
  });
});
