import { Route } from "@/src/infra/shared/entities/Route";
import { loginBody, loginResponses } from "./login.gateway";
import { sessionModule } from "@/src/models/session/SessionModule";
import { authModule } from "@/src/models/auth/AuthModule";
import { webserverModule } from "@/src/models/webserver/WebserverModule";

export const loginRoute = Route.create({
  path: "/v1/sessions",
  method: "post",
  tags: ["Session"],
  summary: "Session",
  description: "Authenticate a user and return a JWT",
  response: loginResponses,
  body: loginBody,
  preHandler: [Route.canRequest("create:session")],
  handler: async (request, reply) => {
    const { email, password } = request.body;

    const { Sessions } = sessionModule;
    const { Auth } = authModule;
    const { Controller } = webserverModule;

    const { user, organization, member } = await Auth.getAuthenticatedUser({
      email,
      password,
    });
    const { accessToken, refreshToken } = await Sessions.createForUser({
      user,
    });

    Controller.setSessionCookies({
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
      orgId: organization.id,
      memberId: member.id,
      reply,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
