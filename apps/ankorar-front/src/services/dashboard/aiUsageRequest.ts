import { connection } from "@/services/ankorarApi/axios";

export type PlanSlug = "free" | "basics" | "premium" | "master" | "integration";

export interface AiUsageByPlan {
  plan_slug: PlanSlug;
  users_count: number;
  limit_per_user: number;
  total_consumed: number;
  average_per_user: number;
  credits_remaining_total: number;
}

export interface AiUsageMetrics {
  users_with_ai_in_period: number;
  total_credits_consumed_current_period: number;
  average_credits_per_user: number;
  credits_remaining_total: number;
  by_plan: AiUsageByPlan[];
}

export async function getDashboardAiUsageRequest() {
  return connection.get<AiUsageMetrics>("/v1/dashboard/metrics/ai-usage");
}

export function parseAiUsageResponse(response: {
  data?: AiUsageMetrics & { status?: number };
  status?: number;
}): AiUsageMetrics | null {
  if (
    response.status !== 200 ||
    !response.data ||
    !("total_credits_consumed_current_period" in response.data)
  )
    return null;
  return response.data as AiUsageMetrics;
}
