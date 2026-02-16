import { Route } from "@/src/infra/shared/entities/Route";
import { listOrganizationMembersResponses } from "./listOrganizationMembers.gateway";

function featuresToRole(
  features: string[],
  isCreator: boolean,
): "owner" | "admin" | "member" {
  if (isCreator) {
    return "owner";
  }

  if (features.includes("read:organization") && features.length > 2) {
    return "admin";
  }

  return "member";
}

export const listOrganizationMembersRoute = Route.create({
  path: "/v1/organizations/members",
  method: "get",
  tags: ["Organizations"],
  summary: "List organization members",
  description:
    "List all members and pending invites for the authenticated organization",
  response: listOrganizationMembersResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Members, Organizations } = modules.organization;
    const organization = request.context.organization;

    const { members: membersWithUser } =
      await Members.fns.findByOrganizationId({
        organizationId: organization.id,
      });

    const { invites } = await Organizations.fns.findPendingInvitesByOrganizationId(
      {
        organizationId: organization.id,
      },
    );

    const membersList = membersWithUser.map(({ member, user }) => ({
      id: member.id,
      type: "member" as const,
      name: user.name,
      email: user.email,
      role: featuresToRole(member.features, user.id === organization.creator_id),
      status: "active" as const,
    }));

    const invitesList = invites.map(({ invite, user }) => ({
      id: invite.id,
      type: "invite" as const,
      name: user.name,
      email: user.email,
      role: "member" as const,
      status: "invited" as const,
    }));

    const members = [...membersList, ...invitesList];

    return reply.status(200).send({
      status: 200,
      data: {
        members,
      },
    });
  },
});
