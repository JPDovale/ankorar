import { connection } from "@/services/ankorarApi/axios";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  created_at: string;
  subscription_status: string | null;
  stripe_price_id: string | null;
}

export interface ListUsersData {
  users: UserListItem[];
  total: number;
}

export async function listUsersRequest(params?: {
  limit?: number;
  offset?: number;
}) {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const q = search.toString();
  return connection.get<ListUsersData>(
    `/v1/users/list${q ? `?${q}` : ""}`,
  );
}
