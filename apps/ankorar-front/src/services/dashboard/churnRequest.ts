import { connection } from "@/services/ankorarApi/axios";

export interface ChurnMetrics {
  by_status: Record<string, number>;
  active_count: number;
  canceled_count: number;
  trialing_count: number;
  past_due_count: number;
  total_with_plan: number;
  churn_rate: number;
}

export async function getDashboardChurnRequest() {
  return connection.get<ChurnMetrics>("/v1/dashboard/metrics/churn");
}

export function parseChurnResponse(response: {
  data?: ChurnMetrics & { status?: number };
  status?: number;
}): ChurnMetrics | null {
  if (response.status !== 200 || !response.data || !("by_status" in response.data)) return null;
  return response.data as ChurnMetrics;
}
