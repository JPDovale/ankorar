import { Route } from "@/src/infra/shared/entities/Route";
import { getChurnMetrics } from "@/src/models/dashboard/getChurnMetrics";
import { churnResponse } from "./churn.gateway";

export const dashboardChurnRoute = Route.create({
  path: "/v1/dashboard/metrics/churn",
  method: "get",
  tags: ["Dashboard"],
  summary: "Churn metrics",
  description: "Subscription status breakdown and churn rate",
  response: churnResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (_request, reply) => {
    const data = await getChurnMetrics();
    return reply.status(200).send({ status: 200, data });
  },
});
