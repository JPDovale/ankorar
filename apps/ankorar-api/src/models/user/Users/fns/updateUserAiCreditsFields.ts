import { db } from "@/src/infra/database/pool";
import { dateModule } from "@/src/models/date/DateModule";

type UpdateUserAiCreditsFieldsInput = {
  userId: string;
  aiCredits: number;
  aiCreditsResetAt: Date | null;
};

type UpdateUserAiCreditsFieldsResponse = void;

export async function updateUserAiCreditsFields({
  userId,
  aiCredits,
  aiCreditsResetAt,
}: UpdateUserAiCreditsFieldsInput): Promise<UpdateUserAiCreditsFieldsResponse> {
  await db.user.update({
    where: { id: userId },
    data: {
      ai_credits: Math.max(0, Math.floor(aiCredits)),
      ai_credits_reset_at: aiCreditsResetAt,
      updated_at: dateModule.Date.nowUtcDate(),
    },
  });
}
