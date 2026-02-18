import { Route } from "@/src/infra/shared/entities/Route";
import { JsonValue } from "@/src/models/map/Maps/Map";
import {
  updateMapForMemberBody,
  updateMapForMemberParams,
  updateMapForMemberResponses,
} from "./updateMapForMember.gateway";

export const updateMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id",
  method: "put",
  bodyLimit: 25 * 1024 * 1024,
  tags: ["Maps"],
  summary: "Update map for member",
  description:
    "Update map content and preview for a member. The member must be the map owner and belong to the request organization.",
  params: updateMapForMemberParams,
  body: updateMapForMemberBody,
  response: updateMapForMemberResponses,
  preHandler: [Route.canRequest("update:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const organization = request.context.organization;
    const sanitizedContent = request.body.content as JsonValue[];
    const preview = request.body.preview as string | undefined;

    await Maps.updateForMember({
      mapId: request.params.map_id,
      memberId: request.params.member_id,
      organizationId: organization.id,
      content: sanitizedContent,
      preview,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
