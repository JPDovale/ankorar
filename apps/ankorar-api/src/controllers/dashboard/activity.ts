import { Route } from "@/src/infra/shared/entities/Route";
import { getActivityMetrics } from "@/src/models/dashboard/getActivityMetrics";
import { activityResponse } from "./activity.gateway";

export const dashboardActivityRoute = Route.create({
  path: "/v1/dashboard/metrics/activity",
  method: "get",
  tags: ["Dashboard"],
  summary: "Activity metrics",
  description: "Users, maps and organizations created per day",
  response: activityResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (request, reply) => {
    const raw = request.query as Record<string, unknown>;
    const periodDays = (raw?.period as string) === "7" ? 7 : 30;
    const data = await getActivityMetrics(periodDays);
    return reply.status(200).send({ status: 200, data });
  },
});
