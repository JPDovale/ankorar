import { Route } from "@/src/infra/shared/entities/Route";
import {
  createCheckoutSessionBody,
  createCheckoutSessionResponses,
} from "./createCheckoutSession.gateway";

const FRONTEND_URL =
  process.env.FRONTEND_URL ?? "http://localhost:5597";

export const createCheckoutSessionRoute = Route.create({
  path: "/v1/checkout/session",
  method: "post",
  tags: ["Subscription"],
  summary: "Create checkout session",
  description:
    "Create a Stripe Checkout session for the authenticated user to subscribe to a plan. Returns the URL to redirect the user to.",
  body: createCheckoutSessionBody,
  response: createCheckoutSessionResponses,
  preHandler: [Route.canRequest("create:checkout")],
  handler: async (request, reply, { modules }) => {
    const user = request.context.user;
    const { price_id } = request.body;

    const { Stripe } = modules.stripe;
    const { Users } = modules.user;

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const stripe = modules.stripe.client;
      const { customer } = await Stripe.createCustomer(stripe, {
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await Users.fns.updateSubscriptionFields({
        userId: user.id,
        stripeCustomerId: customerId,
      });
    }

    const stripe = modules.stripe.client;
    const { session } = await Stripe.createCheckoutSession(stripe, {
      customerId: customerId ?? undefined,
      priceId: price_id,
      successUrl: `${FRONTEND_URL}/subscription?success=1`,
      cancelUrl: `${FRONTEND_URL}/pricing`,
      clientReferenceId: user.id,
    });

    if (!session.url) {
      return reply.status(400).send({
        status: 400,
        error: { message: "Checkout session has no URL" },
      });
    }

    return reply.status(200).send({
      status: 200,
      data: { url: session.url },
    });
  },
});
