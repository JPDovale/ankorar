import { Route } from "@/src/infra/shared/entities/Route";
import {
  revokeApiKeyParams,
  revokeApiKeyResponses,
} from "./revokeApiKey.gateway";

export const revokeApiKeyRoute = Route.create({
  path: "/v1/organizations/api_keys/:api_key_id/revoke",
  method: "post",
  tags: ["Organizations"],
  summary: "Revoke an API key",
  description:
    "Revoke an API key of the authenticated organization. Revoked keys cannot be used.",
  params: revokeApiKeyParams,
  response: revokeApiKeyResponses,
  preHandler: [Route.canRequest("create:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;
    const organization = request.context.organization;

    await ApiKeys.revoke({
      id: request.params.api_key_id,
      organization_id: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
