import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import { getUserSubscriptionResponses } from "./getUserSubscription.gateway";

export const getUserSubscriptionRoute = Route.create({
  path: "/v1/users/me/subscription",
  method: "get",
  tags: ["Subscription"],
  summary: "Get current user subscription",
  description: "Return the authenticated user's subscription status, plan and limits.",
  response: getUserSubscriptionResponses,
  preHandler: [Route.canRequest("read:subscription")],
  handler: async (request, reply) => {
    const user = request.context.user;
    const limits = getPlanLimits(user.stripe_price_id);

    const data = {
      subscription_status: user.subscription_status,
      stripe_price_id: user.stripe_price_id,
      current_period_end: null as string | null,
      limits: {
        max_maps: limits.max_maps,
        max_organizations_join: limits.max_organizations_join,
        max_organizations_create: limits.max_organizations_create,
        max_libraries: limits.max_libraries,
        ai_credits_per_month: limits.ai_credits_per_month,
      },
      ai_credits: user.ai_credits,
      ai_credits_reset_at: user.ai_credits_reset_at
        ? user.ai_credits_reset_at.toISOString()
        : null,
    };

    return reply.status(200).send({
      status: 200,
      data,
    });
  },
});
