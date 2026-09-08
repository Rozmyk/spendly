import { fromNodeHeaders } from "better-auth/node";
import { FastifyInstance } from "fastify";

import { auth } from "@core/auth/index.js";

export default async (fastify: FastifyInstance) => {
  fastify.route({
    method: ["GET", "POST"],
    url: "/auth/*",
    async handler(request, reply) {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const response = await auth.handler(new Request(url, {
        method: request.method,
        headers: fromNodeHeaders(request.headers),
        body: request.body ? JSON.stringify(request.body) : undefined,
      }));

      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.status(response.status).send(await response.json());
    },
  });
};
