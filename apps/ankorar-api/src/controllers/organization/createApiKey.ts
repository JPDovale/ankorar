import { Route } from "@/src/infra/shared/entities/Route";
import {
  createApiKeyBody,
  createApiKeyResponses,
} from "./createApiKey.gateway";

export const createApiKeyRoute = Route.create({
  path: "/v1/organizations/api_keys",
  method: "post",
  tags: ["Organizations"],
  summary: "Create a api key for organization",
  description:
    "Create a api key for organization. Optional expires_at (ISO date); optional features (array of permission strings). If features is omitted, the key gets all organization API key features (members and maps).",
  body: createApiKeyBody,
  response: createApiKeyResponses,
  preHandler: [Route.canRequest("create:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;
    const organization = request.context.organization;

    const result = await ApiKeys.createForOrganization({
      organization,
      rawExpiresAt: request.body?.expires_at,
      rawFeatures: request.body?.features,
    });

    if (!result.ok) {
      return reply
        .status(result.validation.status)
        .send({ status: result.validation.status, error: result.validation.error });
    }

    return reply.status(201).send({
      status: 201,
      data: {
        api_key: result.text,
      },
    });
  },
});
