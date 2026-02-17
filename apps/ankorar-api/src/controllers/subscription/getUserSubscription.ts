import { Route } from "@/src/infra/shared/entities/Route";
import { getUserSubscriptionResponses } from "./getUserSubscription.gateway";

export const getUserSubscriptionRoute = Route.create({
  path: "/v1/users/me/subscription",
  method: "get",
  tags: ["Subscription"],
  summary: "Get current user subscription",
  description: "Return the authenticated user's subscription status and plan.",
  response: getUserSubscriptionResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply) => {
    const user = request.context.user;

    const data =
      user.subscription_status || user.stripe_price_id
        ? {
            subscription_status: user.subscription_status,
            stripe_price_id: user.stripe_price_id,
            current_period_end: null as string | null,
          }
        : null;

    return reply.status(200).send({
      status: 200,
      data,
    });
  },
});
