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
  handler: async (request, reply, { modules }) => {
    const payload = request.context.user;
    const token = request.context.refresh_token;
    const orgId = request.context.organization.id;
    const memberId = request.context.member.id;

    const { Sessions } = modules.session;
    const { Controller } = modules.webserver;

    const { accessToken, refreshToken } = await Sessions.refresh({
      token,
    });

    Controller.setSessionCookies({
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
      orgId,
      memberId,
      reply,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        user: payload,
      },
    });
  },
});
