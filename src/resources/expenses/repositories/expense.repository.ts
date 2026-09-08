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

class ExpenseRepository {
  private prisma: PrismaClient;

  public constructor() {
    this.prisma = new PrismaClient();
  }

  public async create(data: Api.Schemas.Expenses.Create.Body, userId: string): Promise<Expense> {
    const [expense] = await this.prisma.$queryRaw<Expense[]>(Prisma.sql`
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

  public async findAll(userId: string): Promise<Expense[]> {
    return this.prisma.$queryRaw<Expense[]>(Prisma.sql`
      SELECT
        "id",
        "amount"::float8 AS "amount",
        "description",
        "category_id" AS "categoryId",
        "created_at" AS "createdAt",
        "updated_at" AS "updatedAt"
      FROM "expense"
      WHERE "user_id" = ${userId}::uuid
      ORDER BY "created_at" DESC
    `);
  }

  public async findById(id: number, userId: string): Promise<Expense | null> {
    const [expense] = await this.prisma.$queryRaw<Expense[]>(Prisma.sql`SELECT "id", "amount"::float8 AS "amount", "description", "category_id" AS "categoryId", "created_at" AS "createdAt", "updated_at" AS "updatedAt" FROM "expense" WHERE "id" = ${id} AND "user_id" = ${userId}::uuid`);
    return expense || null;
  }

  public async update(id: number, userId: string, data: UpdateExpense): Promise<Expense | null> {
    const fields: Prisma.Sql[] = [];
    if (data.amount !== undefined) fields.push(Prisma.sql`"amount" = ${data.amount}`);
    if (data.description !== undefined) fields.push(Prisma.sql`"description" = ${data.description}`);
    if (data.categoryId !== undefined) fields.push(Prisma.sql`"category_id" = ${data.categoryId}`);
    fields.push(Prisma.sql`"updated_at" = CURRENT_TIMESTAMP`);
    const [expense] = await this.prisma.$queryRaw<Expense[]>(Prisma.sql`UPDATE "expense" SET ${Prisma.join(fields, ", ")} WHERE "id" = ${id} AND "user_id" = ${userId}::uuid RETURNING "id", "amount"::float8 AS "amount", "description", "category_id" AS "categoryId", "created_at" AS "createdAt", "updated_at" AS "updatedAt"`);
    return expense || null;
  }

  public async delete(id: number, userId: string): Promise<boolean> {
    return (await this.prisma.$executeRaw(Prisma.sql`DELETE FROM "expense" WHERE "id" = ${id} AND "user_id" = ${userId}::uuid`)) === 1;
  }
}

export const expenseRepository = new ExpenseRepository();
