import { Route } from "@/src/infra/shared/entities/Route";
import {
  createMapForMemberBody,
  createMapForMemberParams,
  createMapForMemberResponses,
} from "./createMapForMember.gateway";

export const createMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps",
  method: "post",
  tags: ["Maps"],
  summary: "Create map for member",
  description:
    "Create a map for a member. The member must belong to the request organization.",
  params: createMapForMemberParams,
  body: createMapForMemberBody,
  response: createMapForMemberResponses,
  preHandler: [Route.canRequest("create:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Libraries } = modules.library;
    const organization = request.context.organization;

    const { map } = await Maps.createForMember({
      memberId: request.params.member_id,
      organizationId: organization.id,
      title: request.body.title,
    });

    if (request.body.library_id) {
      await Libraries.connectMap({
        id: request.body.library_id,
        organizationId: organization.id,
        mapId: map.id,
      });
    }

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
