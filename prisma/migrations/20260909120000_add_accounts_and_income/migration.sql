CREATE TABLE "wallet_account" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "opening_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "wallet_account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "wallet_account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "wallet_account_user_id_idx" ON "wallet_account"("user_id");

CREATE TABLE "income" (
  "id" SERIAL NOT NULL,
  "user_id" UUID NOT NULL,
  "amount" DECIMAL(12,2) NOT NULL,
  "description" TEXT NOT NULL,
  "received_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "income_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "income_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "income_user_id_received_at_idx" ON "income"("user_id", "received_at" DESC);
