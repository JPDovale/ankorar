import { Route } from "@/src/infra/shared/entities/Route";
import { activationModule } from "@/src/models/activation/ActivationModule";
import { userModule } from "@/src/models/user/UserModule";
import { activateParams, activateResponses } from "./activate.gateway";

export const activateRoute = Route.create({
  path: "/v1/activations/:token_id",
  method: "patch",
  tags: ["Activation"],
  summary: "Activate a account",
  description: "Activate account of user on system",
  response: activateResponses,
  params: activateParams,
  preHandler: [Route.canRequest("read:activation_token")],
  handler: async (request, reply) => {
    const { ActivationTokens } = activationModule;
    const { Users } = userModule;

    const { activationToken } = await ActivationTokens.fns.findValidById({
      id: request.params.token_id,
    });

    await Users.activateById({ id: activationToken.user_id });
    await ActivationTokens.markTokenAsUsed({
      activationToken,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
