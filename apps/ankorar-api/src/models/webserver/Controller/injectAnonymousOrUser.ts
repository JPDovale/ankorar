import { FastifyReply, FastifyRequest } from "fastify";
import { injectAnonymousUser } from "./fns/injectAnonymousUser";
import { injectAuthenticatedUser } from "./fns/injectAuthenticatedUser";
import { injectAuthenticatedWithApiKey } from "./fns/injectAuthenticatedWithApiKey";
import { refreshSessionBeforeInject } from "./fns/refreshSessionBeforeInject";

type InjectAnonymousOrUserInput = {
  request: FastifyRequest;
  reply: FastifyReply;
};

type InjectAnonymousOrUserResponse = Promise<void>;

export async function injectAnonymousOrUser({
  request,
  reply,
}: InjectAnonymousOrUserInput): InjectAnonymousOrUserResponse {
  if (request.headers["x-api-key"]) {
    await injectAuthenticatedWithApiKey({ request });
    return;
  }

  await refreshSessionBeforeInject({ request, reply });

  if (request.headers.cookie && request.headers.cookie.includes("access_token")) {
    await injectAuthenticatedUser({ request, reply });
    return;
  }

  injectAnonymousUser({ request });
}
