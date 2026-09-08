-- Legacy expenses remain unassigned. The API only exposes rows owned by the authenticated user.
ALTER TABLE "expense" ADD COLUMN "user_id" UUID;

ALTER TABLE "expense"
  ADD CONSTRAINT "expense_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "expense_user_id_idx" ON "expense"("user_id");

CREATE TABLE "budget" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "monthly_limit" DECIMAL(12,2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "budget_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "budget_user_id_key" UNIQUE ("user_id"),
  CONSTRAINT "budget_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
