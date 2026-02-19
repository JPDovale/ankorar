import { Route } from "@/src/infra/shared/entities/Route";
import { getAiUsageMetrics } from "@/src/models/dashboard/getAiUsageMetrics";
import { aiUsageResponse } from "./aiUsage.gateway";

export const dashboardAiUsageRoute = Route.create({
  path: "/v1/dashboard/metrics/ai-usage",
  method: "get",
  tags: ["Dashboard"],
  summary: "AI usage metrics",
  description:
    "Credits consumed (current period), average per user, breakdown by plan for pricing insights",
  response: aiUsageResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (_request, reply) => {
    const data = await getAiUsageMetrics();
    return reply.status(200).send({ status: 200, data });
  },
});
