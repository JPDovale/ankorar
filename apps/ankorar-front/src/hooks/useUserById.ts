import { useQuery } from "@tanstack/react-query";
import {
  getUserByIdRequest,
  type UserDetailData,
} from "@/services/users/getUserByIdRequest";

export const userByIdQueryKey = ["users", "by-id"] as const;

async function userByIdQueryFn(userId: string): Promise<UserDetailData | null> {
  const response = await getUserByIdRequest(userId);
  if (response.status !== 200 || !response.data) return null;
  const data = response.data as { user: UserDetailData };
  return data.user ?? null;
}

export function useUserById(userId: string | undefined) {
  return useQuery({
    queryKey: [...userByIdQueryKey, userId ?? ""],
    queryFn: () => (userId ? userByIdQueryFn(userId) : Promise.resolve(null)),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
}
