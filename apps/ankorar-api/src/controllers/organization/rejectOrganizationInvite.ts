import { Route } from "@/src/infra/shared/entities/Route";
import {
  rejectOrganizationInviteParams,
  rejectOrganizationInviteResponses,
} from "./rejectOrganizationInvite.gateway";

export const rejectOrganizationInviteRoute = Route.create({
  path: "/v1/organizations/invites/:invite_id/reject",
  method: "patch",
  tags: ["Organizations"],
  summary: "Reject organization invite",
  description: "Reject pending invite targeted to authenticated user",
  params: rejectOrganizationInviteParams,
  response: rejectOrganizationInviteResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const user = request.context.user;

    await Organizations.rejectInvite({
      inviteId: request.params.invite_id,
      user,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
