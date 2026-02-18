import { Route } from "@/src/infra/shared/entities/Route";
import { listApiKeysResponses } from "./listApiKeys.gateway";

export const listApiKeysRoute = Route.create({
  path: "/v1/organizations/api_keys",
  method: "get",
  tags: ["Organizations"],
  summary: "List api keys for organization",
  description: "List all api keys for the authenticated organization",
  response: listApiKeysResponses,
  preHandler: [Route.canRequest("read:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;
    const organization = request.context.organization;

    const { apiKeys } = await ApiKeys.fns.findByOrganizationId({
      organization_id: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        api_keys: apiKeys.map((apiKey) => ({
          id: apiKey.id,
          prefix: apiKey.prefix,
          env: apiKey.env,
          features: apiKey.features,
          created_at: apiKey.created_at,
          last_used_at: apiKey.last_used_at,
          revoked_at: apiKey.revoked_at,
          expires_at: apiKey.expires_at,
        })),
      },
    });
  },
});
