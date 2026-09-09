CREATE INDEX "expense_user_id_created_at_idx" ON "expense"("user_id", "created_at" DESC, "id" DESC);
