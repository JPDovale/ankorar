import { Route } from "@/src/infra/shared/entities/Route";
import {
  createMapForOwnerBody,
  createMapForOwnerResponses,
} from "./createMapForOwner.gateway";

export const createMapForOwnerRoute = Route.create({
  path: "/v1/maps/for-owner",
  method: "post",
  tags: ["Maps"],
  summary: "Create map for owner",
  description:
    "Create a map for the organization owner. Requires create:map:other.",
  body: createMapForOwnerBody,
  response: createMapForOwnerResponses,
  preHandler: [Route.canRequest("create:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Libraries } = modules.library;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    const { map } = await Maps.createForMember({
      memberId: ownerMember.id,
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
