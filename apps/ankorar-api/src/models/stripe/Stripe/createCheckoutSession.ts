import Stripe from "stripe";

type CreateCheckoutSessionInput = {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  clientReferenceId: string;
};

type CreateCheckoutSessionResponse = {
  session: Stripe.Checkout.Session;
};

export async function createCheckoutSession(
  stripe: Stripe,
  input: CreateCheckoutSessionInput,
): Promise<CreateCheckoutSessionResponse> {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    locale: "pt-BR",
    line_items: [
      {
        price: input.priceId,
        quantity: 1,
      },
    ],
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    client_reference_id: input.clientReferenceId,
  };

  if (input.customerId) {
    params.customer = input.customerId;
  } else if (input.customerEmail) {
    params.customer_email = input.customerEmail;
  }

  const session = await stripe.checkout.sessions.create(params);

  return { session };
}
