import { db } from "@/src/infra/database/pool";
import {
  getPlanLimits,
  getPlanSlug,
  type PlanSlug,
} from "@/src/models/subscription/planConfig";

export type AiUsageByPlan = {
  plan_slug: PlanSlug;
  users_count: number;
  limit_per_user: number;
  total_consumed: number;
  average_per_user: number;
  credits_remaining_total: number;
};

export type AiUsageMetrics = {
  /** Só usuários em período ativo (reset_at > now) com plano que tem créditos. */
  users_with_ai_in_period: number;
  /** Total de créditos consumidos no período atual (soma de limit - ai_credits). */
  total_credits_consumed_current_period: number;
  /** Média de créditos consumidos por usuário (com plano IA) no período. */
  average_credits_per_user: number;
  /** Total de créditos ainda disponíveis (soma ai_credits) para quem tem plano IA. */
  credits_remaining_total: number;
  /** Por plano: usuários, limite mensal, consumido, média, créditos restantes. */
  by_plan: AiUsageByPlan[];
};

export async function getAiUsageMetrics(): Promise<AiUsageMetrics> {
  const now = new Date();
  const users = await db.user.findMany({
    where: { deleted_at: null },
    select: {
      ai_credits: true,
      ai_credits_reset_at: true,
      stripe_price_id: true,
    },
  });

  const byPlanMap = new Map<
    PlanSlug,
    { users: number; consumed: number; remaining: number; limit: number }
  >();

  let totalConsumed = 0;
  let totalRemaining = 0;
  let usersWithAiInPeriod = 0;

  for (const u of users) {
    const limits = getPlanLimits(u.stripe_price_id);
    const limit = limits.ai_credits_per_month;
    if (limit === 0) continue;

    const resetAt = u.ai_credits_reset_at ? new Date(u.ai_credits_reset_at) : null;
    const inCurrentPeriod = resetAt !== null && now < resetAt;
    // Consumido = limit - ai_credits só quando 0 < ai_credits < limit (recebeu e já usou algum).
    // Evita supercontagem quando ai_credits = 0 (pode ser "nunca recebeu" ou migração) ou ai_credits >= limit (ainda não usou).
    const consumed =
      inCurrentPeriod && u.ai_credits > 0 && u.ai_credits < limit
        ? limit - u.ai_credits
        : 0;
    const remaining = u.ai_credits;

    const slug = getPlanSlug(u.stripe_price_id);
    const entry = byPlanMap.get(slug) ?? {
      users: 0,
      consumed: 0,
      remaining: 0,
      limit,
    };
    entry.users += 1;
    entry.consumed += consumed;
    entry.remaining += remaining;
    entry.limit = limit;
    byPlanMap.set(slug, entry);

    if (inCurrentPeriod) {
      usersWithAiInPeriod += 1;
      totalConsumed += consumed;
    }
    totalRemaining += remaining;
  }

  const by_plan: AiUsageByPlan[] = Array.from(byPlanMap.entries())
    .filter(([, v]) => v.users > 0)
    .map(([plan_slug, v]) => ({
      plan_slug,
      users_count: v.users,
      limit_per_user: v.limit,
      total_consumed: v.consumed,
      average_per_user: v.users > 0 ? Math.round((v.consumed / v.users) * 100) / 100 : 0,
      credits_remaining_total: v.remaining,
    }))
    .sort((a, b) => b.users_count - a.users_count);

  const average_credits_per_user =
    usersWithAiInPeriod > 0
      ? Math.round((totalConsumed / usersWithAiInPeriod) * 100) / 100
      : 0;

  return {
    users_with_ai_in_period: usersWithAiInPeriod,
    total_credits_consumed_current_period: totalConsumed,
    average_credits_per_user,
    credits_remaining_total: totalRemaining,
    by_plan,
  };
}
