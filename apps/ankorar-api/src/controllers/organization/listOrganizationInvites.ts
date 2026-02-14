import { Route } from "@/src/infra/shared/entities/Route";
import { listOrganizationInvitesResponses } from "./listOrganizationInvites.gateway";

export const listOrganizationInvitesRoute = Route.create({
  path: "/v1/organizations/invites",
  method: "get",
  tags: ["Organizations"],
  summary: "List organization invites for authenticated user",
  description: "List pending invites where authenticated user is target",
  response: listOrganizationInvitesResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const user = request.context.user;

    const { invites } = await Organizations.listPendingInvitesByUserId({
      userId: user.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        invites,
      },
    });
  },
});
