import { Prisma, PrismaClient } from "@prisma/client";

export interface Expense {
  id: number;
  amount: number;
  description: string;
  categoryId: number;
  createdAt: Date;
}

class ExpenseRepository {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(data: Api.Schemas.Expenses.Create.Body): Promise<Expense> {
    const [expense] = await this.prisma.$queryRaw<Expense[]>(Prisma.sql`
      INSERT INTO "expense" ("amount", "description", "category_id")
      VALUES (${data.amount}, ${data.description}, ${data.categoryId})
      RETURNING
        "id",
        "amount"::float8 AS "amount",
        "description",
        "category_id" AS "categoryId",
        "created_at" AS "createdAt"
    `);

    return expense;
  }

  public async findAll(): Promise<Expense[]> {
    return this.prisma.$queryRaw<Expense[]>(Prisma.sql`
      SELECT
        "id",
        "amount"::float8 AS "amount",
        "description",
        "category_id" AS "categoryId",
        "created_at" AS "createdAt"
      FROM "expense"
      ORDER BY "created_at" DESC
    `);
  }
}

export const expenseRepository = new ExpenseRepository();
