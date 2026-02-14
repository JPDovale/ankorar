import { Route } from "@/src/infra/shared/entities/Route";
import { createApiKeyResponses } from "./createApiKey.gateway";

export const createApiKeyRoute = Route.create({
  path: "/v1/organizations/api_keys",
  method: "post",
  tags: ["Organizations"],
  summary: "Create a api key for organization",
  description: "Create a api key for organization on system",
  response: createApiKeyResponses,
  preHandler: [Route.canRequest("create:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;

    const organization = request.context.organization;

    const { text } = await ApiKeys.createForOrganization({ organization });

    return reply.status(201).send({
      status: 201,
      data: {
        api_key: text,
      },
    });
  },
});
