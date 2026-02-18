import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { db } from "@/src/infra/database/pool";
import { getPlanLimits } from "@/src/models/subscription/planConfig";

function startOfNextMonthUtc(from: Date): Date {
  return new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1),
  );
}

type ConsumeAiCreditInput = {
  userId: string;
};

type ConsumeAiCreditResponse = void;

/**
 * Consome 1 crédito de IA do usuário. Se o período mensal passou, reseta os
 * créditos conforme o plano. Dispara erro se não houver créditos.
 */
export async function consumeAiCredit({
  userId,
}: ConsumeAiCreditInput): Promise<ConsumeAiCreditResponse> {
  await db.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: { id: userId, deleted_at: null },
      select: {
        ai_credits: true,
        ai_credits_reset_at: true,
        stripe_price_id: true,
      },
    });

    if (!user) {
      throw new UserNotFound();
    }

    const limits = getPlanLimits(user.stripe_price_id);
    const now = new Date();
    const resetAt = user.ai_credits_reset_at
      ? new Date(user.ai_credits_reset_at)
      : null;

    let credits = user.ai_credits;
    let newResetAt = resetAt;

    if (!resetAt || now >= resetAt) {
      credits = limits.ai_credits_per_month;
      newResetAt = startOfNextMonthUtc(now);
      await tx.user.update({
        where: { id: userId },
        data: {
          ai_credits: credits,
          ai_credits_reset_at: newResetAt,
          updated_at: now,
        },
      });
    }

    if (credits < 1) {
      throw new PlanLimitExceeded({
        message:
          "Seus créditos de IA deste mês acabaram. Eles renovam todo mês ou faça upgrade do plano.",
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        ai_credits: credits - 1,
        updated_at: now,
      },
    });
  });
}
