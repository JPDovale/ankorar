import { Route } from "@/src/infra/shared/entities/Route";
import {
  cancelOrganizationInviteParams,
  cancelOrganizationInviteResponses,
} from "./cancelOrganizationInvite.gateway";

export const cancelOrganizationInviteRoute = Route.create({
  path: "/v1/organizations/invites/:invite_id",
  method: "delete",
  tags: ["Organizations"],
  summary: "Cancel organization invite",
  description:
    "Cancel a pending invite from the authenticated organization",
  params: cancelOrganizationInviteParams,
  response: cancelOrganizationInviteResponses,
  preHandler: [Route.canRequest("cancel:organization_invite")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const organization = request.context.organization;

    await Organizations.cancelInvite({
      inviteId: request.params.invite_id,
      organizationId: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
