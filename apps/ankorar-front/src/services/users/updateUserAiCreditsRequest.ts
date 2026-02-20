import { connection } from "@/services/ankorarApi/axios";

export async function updateUserAiCreditsRequest(
  userId: string,
  body: { ai_credits: number; never_expire?: boolean },
) {
  return connection.patch(`/v1/users/${userId}/ai-credits`, body);
}
