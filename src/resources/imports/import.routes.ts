import { FastifyInstance, FastifyRequest } from "fastify";

import { requireUserId } from "@core/auth/index.js";

const jobParams = { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } };

export default async (fastify: FastifyInstance) => {
  fastify.post("/imports/expenses", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    const userId = await requireUserId(request, reply);
    if (!userId) return;
    const file = await request.file({ limits: { fileSize: 1024 * 1024, files: 1 } });
    if (!file) return reply.code(400).send({ message: "A CSV file is required." });
    if (!file.filename.toLowerCase().endsWith(".csv")) return reply.code(400).send({ message: "Only CSV files are supported." });
    const content = (await file.toBuffer()).toString("utf8");
    if (!content.trim()) return reply.code(400).send({ message: "The CSV file is empty." });
    const job = await fastify.prisma.importJob.create({ data: { userId, fileName: file.filename, content }, select: { id: true, status: true, createdAt: true } });
    return reply.code(202).send(job);
  });

  fastify.get<{ Params: { id: string } }>("/imports/expenses/:id", { schema: { params: jobParams } }, async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const userId = await requireUserId(request, reply);
    if (!userId) return;
    const job = await fastify.prisma.importJob.findFirst({ where: { id: request.params.id, userId }, select: { id: true, fileName: true, status: true, totalRows: true, importedRows: true, skippedRows: true, errorMessage: true, createdAt: true, completedAt: true } });
    return job ? reply.send(job) : reply.code(404).send({ message: "Import job not found." });
  });
};
