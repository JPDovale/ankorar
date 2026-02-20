import { connection } from "@/services/ankorarApi/axios";

export interface UserDetailData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string | null;
  subscription_status: string | null;
  stripe_price_id: string | null;
  stripe_customer_id: string | null;
  ai_credits: number;
  ai_credits_reset_at: string | null;
}

export interface GetUserByIdData {
  user: UserDetailData;
}

export async function getUserByIdRequest(userId: string) {
  return connection.get<GetUserByIdData>(`/v1/users/${userId}`);
}
