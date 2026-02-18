import { organizationApiKeyFeatures } from "@/src/models/auth/Auth/fns/availableFeatures";
import { Route } from "@/src/infra/shared/entities/Route";
import { listAvailableApiKeyFeaturesResponses } from "./listAvailableApiKeyFeatures.gateway";

export const listAvailableApiKeyFeaturesRoute = Route.create({
  path: "/v1/organizations/api_keys/available_features",
  method: "get",
  tags: ["Organizations"],
  summary: "List available features for API keys",
  description:
    "Returns the list of feature identifiers that can be assigned to an API key (organization context: members and maps).",
  response: listAvailableApiKeyFeaturesResponses,
  preHandler: [Route.canRequest("read:api_key")],
  handler: async (_request, reply) => {
    return reply.status(200).send({
      status: 200,
      data: { features: [...organizationApiKeyFeatures] },
    });
  },
});
