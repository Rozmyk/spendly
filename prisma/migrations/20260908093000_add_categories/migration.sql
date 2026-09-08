CREATE TABLE "category" (
  "id" INTEGER NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

INSERT INTO "category" ("id", "name") VALUES
  (1, 'Food'),
  (2, 'Home'),
  (3, 'Transport'),
  (4, 'Entertainment'),
  (5, 'Other');
