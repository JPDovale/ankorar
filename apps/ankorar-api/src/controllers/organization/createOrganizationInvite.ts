import { Route } from "@/src/infra/shared/entities/Route";
import {
  createOrganizationInviteBody,
  createOrganizationInviteResponses,
} from "./createOrganizationInvite.gateway";

export const createOrganizationInviteRoute = Route.create({
  path: "/v1/organizations/invites",
  method: "post",
  tags: ["Organizations"],
  summary: "Create organization invite",
  description: "Create invite by email for authenticated organization",
  body: createOrganizationInviteBody,
  response: createOrganizationInviteResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const organization = request.context.organization;
    const user = request.context.user;

    await Organizations.createInvite({
      organizationId: organization.id,
      invitedByUserId: user.id,
      email: request.body.email,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
