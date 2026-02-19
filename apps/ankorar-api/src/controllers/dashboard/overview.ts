import { Route } from "@/src/infra/shared/entities/Route";
import { getOverviewMetrics } from "@/src/models/dashboard/getOverviewMetrics";
import { overviewResponse } from "./overview.gateway";

export const dashboardOverviewRoute = Route.create({
  path: "/v1/dashboard/metrics/overview",
  method: "get",
  tags: ["Dashboard"],
  summary: "Dashboard overview metrics",
  description: "Key numbers for SaaS dashboard: users, orgs, maps, signups, subscriptions",
  response: overviewResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (_request, reply) => {
    const data = await getOverviewMetrics();
    return reply.status(200).send({ status: 200, data });
  },
});
