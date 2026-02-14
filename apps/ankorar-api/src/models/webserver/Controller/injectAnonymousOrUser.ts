import { FastifyRequest } from "fastify";
import { injectAnonymousUser } from "./fns/injectAnonymousUser";
import { injectAuthenticatedUser } from "./fns/injectAuthenticatedUser";
import { injectAuthenticatedWithApiKey } from "./fns/injectAuthenticatedWithApiKey";

type InjectAnonymousOrUserInput = {
  request: FastifyRequest;
};

type InjectAnonymousOrUserResponse = Promise<void>;

export async function injectAnonymousOrUser({
  request,
}: InjectAnonymousOrUserInput): InjectAnonymousOrUserResponse {
  if (request.headers["x-api-key"]) {
    await injectAuthenticatedWithApiKey({ request });
    return;
  }

  if (request.headers.cookie && request.headers.cookie.includes("access_token")) {
    await injectAuthenticatedUser({ request });
    return;
  }

  injectAnonymousUser({ request });
}
