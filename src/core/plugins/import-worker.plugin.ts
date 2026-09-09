import { parse } from "csv-parse/sync";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

type CsvRow = { amount?: string; description?: string; categoryId?: string; createdAt?: string };

function parseRow(row: CsvRow) {
  const amount = Number(row.amount);
  const categoryId = Number(row.categoryId);
  const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(categoryId) || !row.description?.trim() || Number.isNaN(createdAt.getTime())) return null;
  return { amount, categoryId, description: row.description.trim(), createdAt };
}

export const importWorker: FastifyPluginAsync = fp(async (fastify) => {
  let processing = false;

  const processNext = async () => {
    if (processing) return;
    processing = true;
    let claimedJobId: string | undefined;
    try {
      const job = await fastify.prisma.importJob.findFirst({ where: { status: "queued" }, orderBy: { createdAt: "asc" } });
      if (!job) return;
      const claim = await fastify.prisma.importJob.updateMany({ where: { id: job.id, status: "queued" }, data: { status: "processing" } });
      if (claim.count === 0) return;
      claimedJobId = job.id;

      const rows = parse(job.content, { columns: true, skip_empty_lines: true, trim: true, bom: true }) as CsvRow[];
      const categories = new Set((await fastify.prisma.category.findMany({ select: { id: true } })).map((category) => category.id));
      const validRows = rows.map(parseRow).filter((row): row is NonNullable<typeof row> => row !== null && categories.has(row.categoryId));
      await fastify.prisma.$transaction(validRows.map((row) => fastify.prisma.expense.create({ data: { ...row, userId: job.userId } })));
      await fastify.prisma.importJob.update({ where: { id: job.id }, data: { status: "completed", totalRows: rows.length, importedRows: validRows.length, skippedRows: rows.length - validRows.length, content: "", completedAt: new Date() } });
    } catch (error) {
      fastify.log.error(error, "Expense import failed");
      const message = error instanceof Error ? error.message : "Import failed.";
      if (claimedJobId) await fastify.prisma.importJob.update({ where: { id: claimedJobId }, data: { status: "failed", errorMessage: message, completedAt: new Date() } });
    } finally {
      processing = false;
    }
  };

  const interval = setInterval(() => void processNext(), 1000);
  fastify.addHook("onReady", async () => void processNext());
  fastify.addHook("onClose", async () => clearInterval(interval));
});
