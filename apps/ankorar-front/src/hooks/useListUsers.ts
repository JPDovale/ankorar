import { useQuery } from "@tanstack/react-query";
import {
  listUsersRequest,
  type ListUsersData,
} from "@/services/users/listUsersRequest";

export const listUsersQueryKey = ["users", "list"] as const;

async function listUsersQueryFn(params?: {
  limit?: number;
  offset?: number;
}): Promise<ListUsersData> {
  const response = await listUsersRequest(params);
  if (response.status !== 200 || !response.data) {
    return { users: [], total: 0 };
  }
  const data = response.data as ListUsersData & { status?: number };
  return {
    users: data.users ?? [],
    total: data.total ?? 0,
  };
}

export function useListUsers(params: { limit: number; offset: number }) {
  return useQuery({
    queryKey: [...listUsersQueryKey, params.limit, params.offset],
    queryFn: () => listUsersQueryFn(params),
    refetchOnWindowFocus: false,
  });
}
