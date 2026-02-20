import { connection } from "@/services/ankorarApi/axios";

export async function updateUserSubscriptionRequest(
  userId: string,
  body: { price_id: string | null },
) {
  return connection.patch(`/v1/users/${userId}/subscription`, body);
}
