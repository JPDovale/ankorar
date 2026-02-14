import { Route } from "@/src/infra/shared/entities/Route";
import { createUserBody, createUserResponses } from "./create.gateway";

export const createUserRoute = Route.create({
  path: "/v1/users",
  method: "post",
  tags: ["Users"],
  summary: "Create a user",
  description: "Create a user on system",
  response: createUserResponses,
  body: createUserBody,
  preHandler: [Route.canRequest("create:user")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { ActivationTokens } = modules.activation;

    const { user } = await Users.create(request.body);
    const { activationToken } = await ActivationTokens.createForUser({
      user,
    });

    await ActivationTokens.fns.sendEmailOfActivationToUser({
      user,
      activationToken,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
