import { Prisma, PrismaClient } from "@prisma/client";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateExpense = Partial<Pick<Expense, "amount" | "description" | "categoryId">>;

export interface ListExpensesOptions {
  page: number;
  limit: number;
  categoryId?: number;
  from?: Date;
  to?: Date;
  minAmount?: number;
  maxAmount?: number;
  sort: "asc" | "desc";
}

export interface PaginatedExpenses {
  expenses: Expense[];
  total: number;
}

class ExpenseRepository {
  public async create(prisma: PrismaClient, data: Api.Schemas.Expenses.Create.Body, userId: string): Promise<Expense> {
    const [expense] = await prisma.$queryRaw<Expense[]>(Prisma.sql`
      INSERT INTO "expense" ("amount", "description", "category_id", "user_id")
      VALUES (${data.amount}, ${data.description}, ${data.categoryId}, ${userId}::uuid)
      RETURNING
        "id",
        "amount"::float8 AS "amount",
        "description",
        "category_id" AS "categoryId",
        "created_at" AS "createdAt",
        "updated_at" AS "updatedAt"
    `);

    return expense;
  }

  public async findAll(prisma: PrismaClient, userId: string, options: ListExpensesOptions): Promise<PaginatedExpenses> {
    const where: Prisma.ExpenseWhereInput = {
      userId,
      categoryId: options.categoryId,
      amount: { gte: options.minAmount, lte: options.maxAmount },
      createdAt: { gte: options.from, lte: options.to },
    };
    const [expenses, total] = await prisma.$transaction([
      prisma.expense.findMany({
        where,
        orderBy: [{ createdAt: options.sort }, { id: options.sort }],
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses: expenses.map((expense) => ({ ...expense, amount: Number(expense.amount) })),
      total,
    };
  }

  public async findById(prisma: PrismaClient, id: number, userId: string): Promise<Expense | null> {
    const [expense] = await prisma.$queryRaw<Expense[]>(Prisma.sql`SELECT "id", "amount"::float8 AS "amount", "description", "category_id" AS "categoryId", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "expense" WHERE "id" = ${id} AND "user_id" = ${userId}::uuid`);
    return expense || null;
  }

  public async update(prisma: PrismaClient, id: number, userId: string, data: UpdateExpense): Promise<Expense | null> {
    const fields: Prisma.Sql[] = [];
    if (data.amount !== undefined) fields.push(Prisma.sql`"amount" = ${data.amount}`);
    if (data.description !== undefined) fields.push(Prisma.sql`"description" = ${data.description}`);
    if (data.categoryId !== undefined) fields.push(Prisma.sql`"category_id" = ${data.categoryId}`);
    fields.push(Prisma.sql`"updated_at" = CURRENT_TIMESTAMP`);
    const [expense] = await prisma.$queryRaw<Expense[]>(Prisma.sql`UPDATE "expense" SET ${Prisma.join(fields, ", ")} WHERE "id" = ${id} AND "user_id" = ${userId}::uuid RETURNING "id", "amount"::float8 AS "amount", "description", "category_id" AS "categoryId", "created_at" AS "createdAt", "updated_at" AS "updatedAt"`);
    return expense || null;
  }

  public async delete(prisma: PrismaClient, id: number, userId: string): Promise<boolean> {
    return (await prisma.$executeRaw(Prisma.sql`DELETE FROM "expense" WHERE "id" = ${id} AND "user_id" = ${userId}::uuid`)) === 1;
  }
}

export const expenseRepository = new ExpenseRepository();
