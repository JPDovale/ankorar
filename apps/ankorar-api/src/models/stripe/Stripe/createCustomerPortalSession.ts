import Stripe from "stripe";

type CreateCustomerPortalSessionInput = {
  customerId: string;
  returnUrl: string;
};

type CreateCustomerPortalSessionResponse = {
  session: Stripe.BillingPortal.Session;
};

export async function createCustomerPortalSession(
  stripe: Stripe,
  { customerId, returnUrl }: CreateCustomerPortalSessionInput,
): Promise<CreateCustomerPortalSessionResponse> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    locale: "pt-BR",
  });

  return { session };
}
