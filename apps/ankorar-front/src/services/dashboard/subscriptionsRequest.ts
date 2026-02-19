import { connection } from "@/services/ankorarApi/axios";

export interface SubscriptionByStatus {
  status: string;
  count: number;
}

export interface SubscriptionByPlan {
  stripe_price_id: string | null;
  plan_slug: string;
  count: number;
}

export interface SubscriptionsBreakdown {
  by_status: SubscriptionByStatus[];
  by_plan: SubscriptionByPlan[];
}

export async function getDashboardSubscriptionsRequest() {
  return connection.get<SubscriptionsBreakdown>("/v1/dashboard/metrics/subscriptions");
}

export function parseSubscriptionsResponse(response: {
  data?: SubscriptionsBreakdown & { status?: number };
  status?: number;
}): SubscriptionsBreakdown | null {
  if (response.status !== 200 || !response.data || !("by_status" in response.data)) return null;
  return response.data as SubscriptionsBreakdown;
}
