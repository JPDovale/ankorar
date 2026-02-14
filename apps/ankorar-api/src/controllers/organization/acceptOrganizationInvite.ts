import { Route } from "@/src/infra/shared/entities/Route";
import {
  acceptOrganizationInviteParams,
  acceptOrganizationInviteResponses,
} from "./acceptOrganizationInvite.gateway";

export const acceptOrganizationInviteRoute = Route.create({
  path: "/v1/organizations/invites/:invite_id/accept",
  method: "patch",
  tags: ["Organizations"],
  summary: "Accept organization invite",
  description: "Accept pending invite targeted to authenticated user",
  params: acceptOrganizationInviteParams,
  response: acceptOrganizationInviteResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const user = request.context.user;

    await Organizations.acceptInvite({
      inviteId: request.params.invite_id,
      user,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
