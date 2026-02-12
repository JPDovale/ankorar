import { Route } from "@/src/infra/shared/entities/Route";
import { sessionModule } from "@/src/models/session/SessionModule";
import { webserverModule } from "@/src/models/webserver/WebserverModule";
import { logoutResponses } from "./logout.gateway";

export const logoutRoute = Route.create({
  path: "/v1/sessions",
  method: "delete",
  tags: ["Session"],
  summary: "Logout",
  description: "Terminate authenticated session and clear cookies",
  response: logoutResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply) => {
    const { Sessions } = sessionModule;
    const { Controller } = webserverModule;
    const user = request.context.user;
    const refreshToken = request.context.refresh_token;

    await Sessions.logout({
      userId: user.id,
      refreshToken,
    });

    Controller.clearSessionCookies({
      reply,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
