import { db } from "@/src/infra/database/pool";

const ACTIVE_STATUSES = ["active", "trialing"];

export type ChurnMetrics = {
  by_status: Record<string, number>;
  active_count: number;
  canceled_count: number;
  trialing_count: number;
  past_due_count: number;
  total_with_plan: number;
  churn_rate: number;
};

export async function getChurnMetrics(): Promise<ChurnMetrics> {
  const usersWithStatus = await db.user.groupBy({
    by: ["subscription_status"],
    where: {
      deleted_at: null,
      subscription_status: { not: null },
    },
    _count: { id: true },
  });

  const by_status: Record<string, number> = {};
  let active_count = 0;
  let canceled_count = 0;
  let trialing_count = 0;
  let past_due_count = 0;

  for (const row of usersWithStatus) {
    const status = row.subscription_status ?? "unknown";
    by_status[status] = row._count.id;
    if (status === "active") active_count = row._count.id;
    else if (status === "canceled") canceled_count = row._count.id;
    else if (status === "trialing") trialing_count = row._count.id;
    else if (status === "past_due") past_due_count = row._count.id;
  }

  const total_with_plan = active_count + canceled_count + trialing_count + past_due_count;
  const churn_rate =
    total_with_plan > 0 ? Math.round((canceled_count / total_with_plan) * 10000) / 100 : 0;

  return {
    by_status,
    active_count,
    canceled_count,
    trialing_count,
    past_due_count,
    total_with_plan,
    churn_rate,
  };
}
