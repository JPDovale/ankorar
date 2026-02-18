import type { FastifyRequest } from "fastify";
import Stripe from "stripe";
import { Route } from "@/src/infra/shared/entities/Route";
import { stripeWebhookResponses } from "./stripeWebhook.gateway";

const WEBHOOK_PATH = "/v1/webhooks/stripe";

function getRawBody(request: FastifyRequest): Buffer | undefined {
  return (request as FastifyRequest & { rawBody?: Buffer }).rawBody;
}

export const stripeWebhookRoute = Route.create({
  path: WEBHOOK_PATH,
  method: "post",
  tags: ["Subscription"],
  summary: "Stripe webhook",
  description: "Receives Stripe webhook events (subscription created/updated/deleted).",
  response: stripeWebhookResponses,
  handler: async (request, reply, { modules }) => {
    const rawBody = getRawBody(request);
    const signature = request.headers["stripe-signature"];

    if (!rawBody || typeof signature !== "string") {
      return reply.status(400).send({
        status: 400,
        error: { message: "Missing body or Stripe-Signature header" },
      });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return reply.status(400).send({
        status: 400,
        error: { message: "Webhook secret not configured" },
      });
    }

    const { Stripe } = modules.stripe;
    const { Users } = modules.user;
    const { Members } = modules.organization;

    let event: Stripe.Event;
    try {
      event = Stripe.constructWebhookEvent({
        payload: rawBody,
        signature,
        secret,
      });
    } catch (err) {
      return reply.status(400).send({
        status: 400,
        error: { message: "Invalid signature", details: String(err) },
      });
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id;

      if (!customerId) {
        return reply.status(200).send({
          status: 200,
          data: { received: true },
        });
      }

      try {
        const { user } = await Users.fns.findByStripeCustomerId({
          stripeCustomerId: customerId,
        });

        const status =
          event.type === "customer.subscription.deleted"
            ? "canceled"
            : subscription.status;

        const priceId =
          status === "canceled"
            ? null
            : subscription.items?.data?.[0]?.price?.id ?? null;

        await Users.fns.updateSubscriptionFields({
          userId: user.id,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          subscriptionStatus: status,
        });

        await Members.fns.updateFeaturesForUser({
          userId: user.id,
          stripePriceId: priceId,
        });
      } catch {
        // User not found for this customer - ignore (e.g. test event)
      }
    }

    return reply.status(200).send({
      status: 200,
      data: { received: true },
    });
  },
});

export const STRIPE_WEBHOOK_PATH = WEBHOOK_PATH;
