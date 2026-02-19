import { Route } from "@/src/infra/shared/entities/Route";
import { getOpenAiCosts } from "@/src/models/dashboard/getOpenAiCosts";
import { openaiCostsResponse } from "./openaiCosts.gateway";

export const dashboardOpenAiCostsRoute = Route.create({
  path: "/v1/dashboard/metrics/openai-costs",
  method: "get",
  tags: ["Dashboard"],
  summary: "OpenAI API costs",
  description:
    "Costs from OpenAI Usage/Costs API (organization). Requires org owner API key.",
  response: openaiCostsResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (request, reply) => {
    const raw = request.query as Record<string, unknown>;
    const startTime =
      typeof raw?.start_time === "string"
        ? parseInt(raw.start_time, 10)
        : undefined;
    const endTime =
      typeof raw?.end_time === "string"
        ? parseInt(raw.end_time, 10)
        : undefined;
    const limit =
      typeof raw?.limit === "string" ? parseInt(raw.limit, 10) : undefined;

    const data = await getOpenAiCosts({
      start_time: startTime,
      end_time: endTime,
      limit: limit ?? 30,
      group_by: ["line_item"],
    });
    return reply.status(200).send({ status: 200, data });
  },
});
