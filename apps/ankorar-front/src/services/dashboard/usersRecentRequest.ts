import { connection } from "@/services/ankorarApi/axios";

export interface UsersRecentCounts {
  today: number;
  last_7d: number;
  last_30d: number;
}

export interface UserRecentItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: string | null;
  stripe_price_id: string | null;
}

export interface UsersRecentData {
  counts: UsersRecentCounts;
  users: UserRecentItem[];
  total: number;
}

export async function getDashboardUsersRecentRequest(params?: {
  period?: "7d" | "30d";
  limit?: number;
  offset?: number;
}) {
  const search = new URLSearchParams();
  if (params?.period) search.set("period", params.period);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  return connection.get<UsersRecentData>(
    `/v1/dashboard/metrics/users-recent${q ? `?${q}` : ""}`,
  );
}

export function parseUsersRecentResponse(response: {
  data?: UsersRecentData & { status?: number };
  status?: number;
}): UsersRecentData | null {
  if (response.status !== 200 || !response.data || !("counts" in response.data)) return null;
  return response.data as UsersRecentData;
}
