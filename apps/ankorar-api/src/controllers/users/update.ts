import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateUserBody,
  updateUserParams,
  updateUserResponses,
} from "./update.gateway";
import { userModule } from "@/src/models/user/UserModule";

export const updateUserRoute = Route.create({
  path: "/v1/users/:email",
  method: "patch",
  tags: ["Users"],
  summary: "Update a user",
  description: "Update a user on system",
  response: updateUserResponses,
  body: updateUserBody,
  params: updateUserParams,
  preHandler: [Route.canRequest("create:user")],
  handler: async (request, reply) => {
    const { Users } = userModule;
    const { email: currentEmail } = request.params;
    const { email, name, password } = request.body;

    const { user } = await Users.fns.findByEmail({
      email: currentEmail,
    });

    if (name) {
      user.name = name;
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();

      if (normalizedEmail !== user.email) {
        user.email = normalizedEmail;
        await Users.validateUniqueEmail({ user });
      }
    }

    if (password) {
      user.password = password;
      await Users.hashPassword({ user });
    }

    await Users.fns.persist({ user });

    return reply.status(204).send();
  },
});
