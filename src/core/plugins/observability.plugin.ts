import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { collectDefaultMetrics, Histogram, Registry } from "prom-client";

declare module "fastify" {
  interface FastifyRequest {
    metricsStartedAt: bigint;
  }
}

export const observability: FastifyPluginAsync = fp(async (fastify) => {
  const registry = new Registry();
  const requestDuration = new Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code"] as const,
    registers: [registry],
  });

  collectDefaultMetrics({ register: registry });
  fastify.decorateRequest("metricsStartedAt", 0n);
  fastify.addHook("onRequest", async (request, reply) => {
    request.metricsStartedAt = process.hrtime.bigint();
    reply.header("X-Request-Id", request.id);
  });
  fastify.addHook("onResponse", async (request, reply) => {
    const route = request.routeOptions?.url;
    if (!route || route === "/metrics") return;
    const duration = Number(process.hrtime.bigint() - request.metricsStartedAt) / 1_000_000_000;
    requestDuration.observe({ method: request.method, route, status_code: String(reply.statusCode) }, duration);
  });
  fastify.get("/metrics", async (_request, reply) => reply.type(registry.contentType).send(await registry.metrics()));
});
