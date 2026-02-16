import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateOrganizationNameBody,
  updateOrganizationNameResponses,
} from "./updateOrganizationName.gateway";

export const updateOrganizationNameRoute = Route.create({
  path: "/v1/organizations/identity",
  method: "patch",
  tags: ["Organizations"],
  summary: "Update organization name",
  description: "Update the name of the authenticated organization",
  body: updateOrganizationNameBody,
  response: updateOrganizationNameResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Organizations } = modules.organization;
    const organization = request.context.organization;
    console.log(request.body);

    await Organizations.update({
      organization_id: organization.id,
      name: request.body.name,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
