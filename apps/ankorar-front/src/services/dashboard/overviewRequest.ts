import { connection } from "@/services/ankorarApi/axios";

export interface OverviewMetrics {
  total_users: number;
  total_organizations: number;
  total_maps: number;
  users_created_today: number;
  users_created_last_7d: number;
  users_created_last_30d: number;
  active_subscriptions: number;
  canceled_subscriptions: number;
}

export async function getDashboardOverviewRequest() {
  return connection.get<OverviewMetrics>("/v1/dashboard/metrics/overview");
}

export function parseOverviewResponse(response: { data?: OverviewMetrics & { status?: number }; status?: number }): OverviewMetrics | null {
  if (response.status !== 200 || !response.data || typeof (response.data as OverviewMetrics).total_users !== "number") return null;
  return response.data as OverviewMetrics;
}
