import { connection } from "@/services/ankorarApi/axios";

export interface ActivityDay {
  date: string;
  users_created: number;
  maps_created: number;
  organizations_created: number;
}

export interface ActivityMetrics {
  period_days: number;
  by_day: ActivityDay[];
  total_users_created: number;
  total_maps_created: number;
  total_organizations_created: number;
}

export async function getDashboardActivityRequest(params?: { period?: "7" | "30" }) {
  const search = new URLSearchParams();
  if (params?.period) search.set("period", params.period);
  const q = search.toString();
  return connection.get<ActivityMetrics>(
    `/v1/dashboard/metrics/activity${q ? `?${q}` : ""}`,
  );
}

export function parseActivityResponse(response: {
  data?: ActivityMetrics & { status?: number };
  status?: number;
}): ActivityMetrics | null {
  if (response.status !== 200 || !response.data || !("by_day" in response.data)) return null;
  return response.data as ActivityMetrics;
}
