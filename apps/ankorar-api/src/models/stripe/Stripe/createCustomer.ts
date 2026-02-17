import Stripe from "stripe";

type CreateCustomerInput = {
  email: string;
  metadata?: { user_id: string };
};

type CreateCustomerResponse = {
  customer: Stripe.Customer;
};

export async function createCustomer(
  stripe: Stripe,
  { email, metadata }: CreateCustomerInput,
): Promise<CreateCustomerResponse> {
  const customer = await stripe.customers.create({
    email: email.toLowerCase().trim(),
    metadata: metadata ?? {},
  });

  return { customer };
}
