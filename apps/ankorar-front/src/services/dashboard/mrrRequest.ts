import { connection } from "@/services/ankorarApi/axios";

export interface MrrByPlan {
  price_id: string;
  plan_name: string;
  interval: string;
  count: number;
  amount_cents: number;
  mrr_cents: number;
}

export interface MrrMetrics {
  total_mrr_cents: number;
  currency: string;
  by_plan: MrrByPlan[];
}

export async function getDashboardMrrRequest() {
  return connection.get<MrrMetrics>("/v1/dashboard/metrics/mrr");
}

export function parseMrrResponse(response: {
  data?: MrrMetrics & { status?: number };
  status?: number;
}): MrrMetrics | null {
  if (response.status !== 200 || !response.data || !("total_mrr_cents" in response.data)) return null;
  return response.data as MrrMetrics;
}
