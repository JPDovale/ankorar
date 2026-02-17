import Stripe from "stripe";

export type PlanFromStripe = {
  id: string;
  price_id: string;
  name: string;
  amount: number;
  interval: string;
  features: string[];
};

type ListPricesForPlansInput = {
  stripe: Stripe;
};

type ListPricesForPlansResponse = {
  plans: PlanFromStripe[];
};

function parseFeatures(product: Stripe.Product | Stripe.DeletedProduct): string[] {
  if (product.deleted) {
    return [];
  }
  const raw = product.metadata?.features;
  if (typeof raw !== "string") {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export async function listPricesForPlans({
  stripe,
}: ListPricesForPlansInput): Promise<ListPricesForPlansResponse> {
  const response = await stripe.prices.list({
    active: true,
    type: "recurring",
    expand: ["data.product"],
    limit: 100,
  });

  const plans: PlanFromStripe[] = [];

  for (const price of response.data) {
    if (!price.recurring?.interval) continue;

    const product = price.product;
    const productObj =
      typeof product === "string" ? null : product.deleted ? null : product;

    const name =
      productObj?.name ?? price.nickname ?? price.id;
    const features = productObj ? parseFeatures(productObj) : [];

    plans.push({
      id: productObj?.id ?? price.id,
      price_id: price.id,
      name,
      amount: price.unit_amount ?? 0,
      interval: price.recurring.interval,
      features,
    });
  }

  return { plans };
}
