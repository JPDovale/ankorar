import { Route } from "@/src/infra/shared/entities/Route";
import {
  upsertMemberBody,
  upsertMemberResponses,
} from "./upsertMember.gateway";
import { User } from "@/src/models/user/Users/User";
import { InternalServerError } from "@/src/infra/errors/InternalServerError";
import { safeCall } from "@/src/utils/safeCall";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";

export const upsertMemberRoute = Route.create({
  path: "/v1/organizations/members/upsert",
  method: "post",
  tags: ["Organizations"],
  summary: "Create or update a member for organization",
  description: "Create or update a member for organization on system",
  body: upsertMemberBody,
  response: upsertMemberResponses,
  preHandler: [Route.canRequest("create:user:other")],
  handler: async (request, reply, { modules }) => {
    const organization = request.context.organization;

    const { Users } = modules.user;
    const { Organizations } = modules.organization;

    const userResult = await safeCall(() =>
      Users.fns.findByExtId({
        id: request.body.ext_id,
      }),
    );

    let finalUser: User | null = null;

    if (!userResult.success) {
      if (!(userResult.error instanceof UserNotFound)) {
        throw userResult.error;
      }

      const { user } = await Users.create({
        email: request.body.email,
        name: request.body.name,
        ext_id: request.body.ext_id,
      });

      finalUser = user;
    }

    if (userResult.success) {
      const { user } = userResult.data;
      const { user: updatedUser } = await Users.update({
        id: user.id,
        email: request.body.email,
        name: request.body.name,
      });

      finalUser = updatedUser;
    }

    if (!finalUser) {
      throw new InternalServerError({
        message: "Impossible to define final user",
      });
    }

    await Organizations.upsertMember({
      user: finalUser,
      organization,
      features: ["read:session"],
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
