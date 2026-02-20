import { InvalidCredentials } from "@/src/infra/errors/InvalidCredentials";
import { PasswordNotDefined } from "@/src/infra/errors/PasswordNotDefined";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateUserPasswordBody,
  updateUserPasswordResponses,
} from "./updateUserPassword.gateway";

export const updateUserPasswordRoute = Route.create({
  path: "/v1/user/password",
  method: "patch",
  tags: ["Users"],
  summary: "Update current user password",
  description:
    "Change the authenticated user password. Requires current password.",
  body: updateUserPasswordBody,
  response: updateUserPasswordResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const { Crypto } = modules.crypto;
    const userId = request.context.user.id;
    const { user } = await Users.fns.findById({ id: userId });

    if (!user.password) {
      throw new PasswordNotDefined();
    }

    const passwordMatches = await Crypto.fns.comparePassword({
      password: request.body.current_password,
      hash: user.password,
    });

    if (!passwordMatches) {
      throw new InvalidCredentials();
    }

    user.password = request.body.new_password;
    await Users.hashPassword({ user });
    await Users.fns.persist({ user });

    return reply.status(204).send();
  },
});
