import { Route } from "@/src/infra/shared/entities/Route";
import { getMrrMetrics } from "@/src/models/dashboard/getMrrMetrics";
import { listPricesForPlans } from "@/src/models/stripe/Stripe/listPricesForPlans";
import { mrrResponse } from "./mrr.gateway";

export const dashboardMrrRoute = Route.create({
  path: "/v1/dashboard/metrics/mrr",
  method: "get",
  tags: ["Dashboard"],
  summary: "MRR metrics",
  description: "Monthly recurring revenue by plan",
  response: mrrResponse,
  preHandler: [Route.canRequest("read:saas_dashboard")],
  handler: async (_request, reply, { modules }) => {
    const stripe = modules.stripe.client;
    const { plans } = await listPricesForPlans({ stripe });
    const data = await getMrrMetrics(plans);
    return reply.status(200).send({ status: 200, data });
  },
});
