import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateUserAiCreditsBody,
  updateUserAiCreditsParams,
  updateUserAiCreditsResponses,
} from "./updateUserAiCredits.gateway";

/** Data sentinela: créditos não expiram (consumeAiCredit não reseta). */
const NEVER_EXPIRE_RESET_AT = new Date(Date.UTC(9999, 11, 31));

function startOfNextMonthUtc(from: Date): Date {
  return new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1),
  );
}

export const updateUserAiCreditsRoute = Route.create({
  path: "/v1/users/:user_id/ai-credits",
  method: "patch",
  tags: ["Users"],
  summary: "Update user AI credits (manual)",
  description:
    "Define o saldo de créditos de IA e se expiram ou não. never_expire: true = não expiram. Requer read:user:other.",
  body: updateUserAiCreditsBody,
  params: updateUserAiCreditsParams,
  response: updateUserAiCreditsResponses,
  preHandler: [Route.canRequest("read:user:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { user_id } = request.params as { user_id: string };
    const { ai_credits, never_expire } = request.body;

    await Users.fns.findById({ id: user_id });

    const aiCreditsResetAt = never_expire
      ? NEVER_EXPIRE_RESET_AT
      : startOfNextMonthUtc(new Date());

    await Users.fns.updateAiCreditsFields({
      userId: user_id,
      aiCredits: ai_credits,
      aiCreditsResetAt,
    });

    return reply.status(204).send();
  },
});
