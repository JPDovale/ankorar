import { Route } from "@/src/infra/shared/entities/Route";
import {
  removeMemberParams,
  removeMemberResponses,
} from "./removeMember.gateway";

export const removeMemberRoute = Route.create({
  path: "/v1/organizations/members/:member_id",
  method: "delete",
  tags: ["Organizations"],
  summary: "Remove member from organization",
  description: "Soft delete a member from the authenticated organization",
  params: removeMemberParams,
  response: removeMemberResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Members } = modules.organization;
    const organization = request.context.organization;

    await Members.remove({
      memberId: request.params.member_id,
      organizationId: organization.id,
      organizationCreatorId: organization.creator_id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
