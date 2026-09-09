CREATE TABLE "import_job" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "file_name" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'queued',
  "total_rows" INTEGER NOT NULL DEFAULT 0,
  "imported_rows" INTEGER NOT NULL DEFAULT 0,
  "skipped_rows" INTEGER NOT NULL DEFAULT 0,
  "error_message" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMPTZ,
  CONSTRAINT "import_job_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "import_job_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "import_job_user_id_created_at_idx" ON "import_job"("user_id", "created_at" DESC);
CREATE INDEX "import_job_status_created_at_idx" ON "import_job"("status", "created_at");

CREATE TABLE "idempotency_key" (
  "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "status_code" INTEGER NOT NULL DEFAULT 0,
  "response" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "idempotency_key_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "idempotency_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "idempotency_key_user_id_key_key" UNIQUE ("user_id", "key")
);
