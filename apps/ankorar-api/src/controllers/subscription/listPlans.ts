import { Route } from "@/src/infra/shared/entities/Route";
import { listPlansResponse } from "./listPlans.gateway";

export const listPlansRoute = Route.create({
  path: "/v1/plans",
  method: "get",
  tags: ["Subscription"],
  summary: "List plans",
  description:
    "List available subscription plans from Stripe (active recurring prices with product expanded) for the pricing page.",
  response: { 200: listPlansResponse },
  preHandler: [Route.canRequest("read:plans")],
  handler: async (_request, reply, { modules }) => {
    const stripe = modules.stripe.client;
    const { plans } = await modules.stripe.Stripe.listPricesForPlans({
      stripe,
    });

    return reply.status(200).send({
      status: 200,
      data: { plans },
    });
  },
});
