import { Route } from "@/src/infra/shared/entities/Route";
import { getUserResponses } from "./getUser.gateway";

export const getUserRoute = Route.create({
  path: "/v1/users",
  method: "get",
  tags: ["Users"],
  summary: "Get authenticated user",
  description: "Returns the user info from the access token",
  response: getUserResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply) => {
    const user = request.context.user;
    const features = request.context.member.features;

    return reply.status(200).send({
      status: 200,
      data: {
        user,
        features,
      },
    });
  },
});
