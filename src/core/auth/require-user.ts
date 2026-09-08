import { fromNodeHeaders } from "better-auth/node";
import { FastifyReply, FastifyRequest } from "fastify";

import { auth } from "./auth.js";

export async function requireUserId(request: FastifyRequest, reply: FastifyReply): Promise<string | null> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(request.headers) });

  if (!session) {
    await reply.code(401).send({ statusCode: 401, error: "Unauthorized", message: "Authentication is required." });
    return null;
  }

  return session.user.id;
}
