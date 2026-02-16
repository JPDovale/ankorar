import { Route } from "@/src/infra/shared/entities/Route";
import {
  deleteApiKeyParams,
  deleteApiKeyResponses,
} from "./deleteApiKey.gateway";

export const deleteApiKeyRoute = Route.create({
  path: "/v1/organizations/api_keys/:api_key_id",
  method: "delete",
  tags: ["Organizations"],
  summary: "Delete an API key",
  description:
    "Soft delete an API key. Only revoked keys can be deleted.",
  params: deleteApiKeyParams,
  response: deleteApiKeyResponses,
  preHandler: [Route.canRequest("create:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;
    const organization = request.context.organization;

    await ApiKeys.delete({
      id: request.params.api_key_id,
      organization_id: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
