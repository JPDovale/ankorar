import { Route } from "@/src/infra/shared/entities/Route";
import { createCustomerPortalSessionResponses } from "./createCustomerPortalSession.gateway";

const FRONTEND_URL =
  process.env.FRONTEND_URL ?? "http://localhost:5173";

export const createCustomerPortalSessionRoute = Route.create({
  path: "/v1/customer-portal/session",
  method: "post",
  tags: ["Subscription"],
  summary: "Create customer portal session",
  description:
    "Create a Stripe Customer Portal session so the user can manage their subscription. Returns the URL to redirect the user to.",
  response: createCustomerPortalSessionResponses,
  preHandler: [Route.canRequest("create:portal")],
  handler: async (request, reply, { modules }) => {
    const user = request.context.user;

    if (!user.stripe_customer_id) {
      return reply.status(400).send({
        status: 400,
        error: { message: "User has no Stripe customer ID" },
      });
    }

    const stripe = modules.stripe.client;
    const { session } = await modules.stripe.Stripe.createCustomerPortalSession(
      stripe,
      {
        customerId: user.stripe_customer_id,
        returnUrl: `${FRONTEND_URL}/subscription`,
      },
    );

    return reply.status(200).send({
      status: 200,
      data: { url: session.url },
    });
  },
});
