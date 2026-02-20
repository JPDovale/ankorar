import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateCurrentUserBody,
  updateCurrentUserResponses,
} from "./updateCurrentUser.gateway";

export const updateCurrentUserRoute = Route.create({
  path: "/v1/user",
  method: "patch",
  tags: ["Users"],
  summary: "Update current user profile",
  description: "Update name and/or email of the authenticated user",
  body: updateCurrentUserBody,
  response: updateCurrentUserResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply, { modules }) => {
    const { Users } = modules.user;
    const userId = request.context.user.id;
    const { name, email } = request.body;

    await Users.fns.updateProfileById({
      userId,
      name,
      email,
    });

    return reply.status(204).send();
  },
});
