import { db } from "@/src/infra/database/pool";
import { getPlanSlug } from "@/src/models/subscription/planConfig";

export type SubscriptionByStatus = {
  status: string;
  count: number;
};

export type SubscriptionByPlan = {
  stripe_price_id: string | null;
  plan_slug: string;
  count: number;
};

export type SubscriptionsBreakdown = {
  by_status: SubscriptionByStatus[];
  by_plan: SubscriptionByPlan[];
};

export async function getSubscriptionsBreakdown(): Promise<SubscriptionsBreakdown> {
  const [byStatusRows, byPlanRows] = await Promise.all([
    db.user.groupBy({
      by: ["subscription_status"],
      where: {
        deleted_at: null,
        subscription_status: { not: null },
      },
      _count: { id: true },
    }),
    db.user.groupBy({
      by: ["stripe_price_id"],
      where: {
        deleted_at: null,
        stripe_price_id: { not: null },
      },
      _count: { id: true },
    }),
  ]);

  const by_status: SubscriptionByStatus[] = byStatusRows.map((row) => ({
    status: row.subscription_status ?? "unknown",
    count: row._count.id,
  }));

  const by_plan: SubscriptionByPlan[] = byPlanRows.map((row) => ({
    stripe_price_id: row.stripe_price_id,
    plan_slug: getPlanSlug(row.stripe_price_id),
    count: row._count.id,
  }));

  return { by_status, by_plan };
}
