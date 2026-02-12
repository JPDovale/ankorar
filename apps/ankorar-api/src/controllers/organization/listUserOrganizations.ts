import { Route } from "@/src/infra/shared/entities/Route";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { listUserOrganizationsResponses } from "./listUserOrganizations.gateway";

export const listUserOrganizationsRoute = Route.create({
  path: "/v1/organizations",
  method: "get",
  tags: ["Organizations"],
  summary: "List organizations from authenticated user",
  description: "List all organizations where authenticated user is member",
  response: listUserOrganizationsResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Organizations } = organizationModule;

    const user = request.context.user;
    const currentOrganization = request.context.organization;

    const { organizations } = await Organizations.fns.findByUserId({
      userId: user.id,
    });

    const organizationsPreview = organizations.map(
      ({ organization, member }) => ({
        id: organization.id,
        name: organization.name,
        role: organization.creator_id === user.id ? "Owner" : "Member",
        member_id: member.id,
        features: member.features,
        is_current: organization.id === currentOrganization.id,
      }),
    );

    return reply.status(200).send({
      status: 200,
      data: {
        organizations: organizationsPreview,
      },
    });
  },
});
