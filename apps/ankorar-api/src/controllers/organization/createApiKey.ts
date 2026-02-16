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
    "Create a api key for organization. Optional expires_at (ISO date) for expiration; omit for permanent key.",
  body: createApiKeyBody,
  response: createApiKeyResponses,
  preHandler: [Route.canRequest("create:api_key")],
  handler: async (request, reply, { modules }) => {
    const { ApiKeys } = modules.crypto;
    const organization = request.context.organization;

    const rawExpiresAt = request.body?.expires_at;
    let expires_at: Date | null = null;
    if (rawExpiresAt && rawExpiresAt.trim() !== "") {
      const parsed = new Date(rawExpiresAt);
      if (Number.isNaN(parsed.getTime())) {
        return reply.status(400).send({
          status: 400,
          error: {
            name: "ValidationError",
            message: "Data de expiração inválida.",
            action: "Use uma data no formato ISO (ex: 2026-12-31).",
          },
        });
      }
      expires_at = parsed;
    }

    const { text } = await ApiKeys.createForOrganization({
      organization,
      expires_at,
    });

    return reply.status(201).send({
      status: 201,
      data: {
        api_key: text,
      },
    });
  },
});
