import { db } from "@/src/infra/database/pool";
import type { PlanFromStripe } from "@/src/models/stripe/Stripe/listPricesForPlans";

const ACTIVE_STATUSES = ["active", "trialing"];

export type MrrByPlan = {
  price_id: string;
  plan_name: string;
  interval: string;
  count: number;
  amount_cents: number;
  mrr_cents: number;
};

export type MrrMetrics = {
  total_mrr_cents: number;
  currency: string;
  by_plan: MrrByPlan[];
};

export async function getMrrMetrics(plans: PlanFromStripe[]): Promise<MrrMetrics> {
  const priceIds = plans.map((p) => p.price_id);
  const priceMap = new Map(plans.map((p) => [p.price_id, p]));

  const usersByPrice = await db.user.groupBy({
    by: ["stripe_price_id"],
    where: {
      deleted_at: null,
      subscription_status: { in: ACTIVE_STATUSES },
      stripe_price_id: { in: priceIds },
    },
    _count: { id: true },
  });

  const by_plan: MrrByPlan[] = [];
  let total_mrr_cents = 0;
  const currency = plans[0]?.amount ? "brl" : "usd";

  for (const row of usersByPrice) {
    const priceId = row.stripe_price_id;
    if (!priceId) continue;
    const plan = priceMap.get(priceId);
    if (!plan) continue;
    const count = row._count.id;
    const amount_cents = plan.amount;
    const isAnnual = plan.interval === "year";
    const mrr_cents = isAnnual ? Math.round((amount_cents * count) / 12) : amount_cents * count;
    total_mrr_cents += mrr_cents;
    by_plan.push({
      price_id: priceId,
      plan_name: plan.name,
      interval: plan.interval,
      count,
      amount_cents,
      mrr_cents,
    });
  }

  return {
    total_mrr_cents,
    currency,
    by_plan,
  };
}
