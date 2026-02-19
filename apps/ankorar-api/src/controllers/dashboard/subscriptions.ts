import { Route } from "@/src/infra/shared/entities/Route";
import { getSubscriptionsBreakdown } from "@/src/models/dashboard/getSubscriptionsBreakdown";
import { subscriptionsResponse } from "./subscriptions.gateway";

export const dashboardSubscriptionsRoute = Route.create({
  path: "/v1/dashboard/metrics/subscriptions",
  method: "get",
  tags: ["Dashboard"],
  summary: "Subscriptions breakdown",
  description: "Counts by status and by plan slug",
  response: subscriptionsResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (_request, reply) => {
    const data = await getSubscriptionsBreakdown();
    return reply.status(200).send({ status: 200, data });
  },
});
