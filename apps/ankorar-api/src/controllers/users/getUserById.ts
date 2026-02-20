import { Route } from "@/src/infra/shared/entities/Route";
import {
  getUserByIdParams,
  getUserByIdResponses,
} from "./getUserById.gateway";

export const getUserByIdRoute = Route.create({
  path: "/v1/users/:user_id",
  method: "get",
  tags: ["Users"],
  summary: "Get user by id (other)",
  description:
    "Retorna os dados de um usuário pelo id. Requer read:user:other.",
  params: getUserByIdParams,
  response: getUserByIdResponses,
  preHandler: [Route.canRequest("read:user:other")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { user_id } = request.params as { user_id: string };

    const { user } = await Users.fns.findById({ id: user_id });

    return reply.status(200).send({
      status: 200,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.updated_at,
          subscription_status: user.subscription_status,
          stripe_price_id: user.stripe_price_id,
          stripe_customer_id: user.stripe_customer_id,
          ai_credits: user.ai_credits,
          ai_credits_reset_at: user.ai_credits_reset_at,
        },
      },
    });
  },
});
