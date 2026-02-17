import Stripe from "stripe";

type ConstructWebhookEventInput = {
  payload: string | Buffer;
  signature: string;
  secret: string;
};

type ConstructWebhookEventResponse = Stripe.Event;

export function constructWebhookEvent({
  payload,
  signature,
  secret,
}: ConstructWebhookEventInput): ConstructWebhookEventResponse {
  return Stripe.webhooks.constructEvent(payload, signature, secret) as Stripe.Event;
}
