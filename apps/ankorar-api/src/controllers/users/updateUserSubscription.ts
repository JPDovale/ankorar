import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateUserSubscriptionBody,
  updateUserSubscriptionParams,
  updateUserSubscriptionResponses,
} from "./updateUserSubscription.gateway";

export const updateUserSubscriptionRoute = Route.create({
  path: "/v1/users/:user_id/subscription",
  method: "patch",
  tags: ["Users"],
  summary: "Update user subscription (manual)",
  description:
    "Define ou remove a assinatura do usuário de forma manual. Assinaturas manuais não expiram (não criam subscription no Stripe). Requer read:user:other.",
  body: updateUserSubscriptionBody,
  params: updateUserSubscriptionParams,
  response: updateUserSubscriptionResponses,
  preHandler: [Route.canRequest("read:user:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { Members } = modules.organization;
    const { user_id } = request.params as { user_id: string };
    const { price_id } = request.body;

    const { user } = await Users.fns.findById({ id: user_id });

    const stripePriceId = price_id ?? null;
    const subscriptionStatus = stripePriceId ? "active" : null;

    await Users.fns.updateSubscriptionFields({
      userId: user.id,
      stripePriceId,
      subscriptionStatus,
      stripeSubscriptionId: null,
    });

    await Members.fns.updateFeaturesForUser({
      userId: user.id,
      stripePriceId,
    });

    return reply.status(204).send();
  },
});
