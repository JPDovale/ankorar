import { Route } from "@/src/infra/shared/entities/Route";
import {
  deleteMapForMemberParams,
  deleteMapForMemberResponses,
} from "./deleteMapForMember.gateway";

export const deleteMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id",
  method: "delete",
  tags: ["Maps"],
  summary: "Delete map for member",
  description:
    "Soft delete a map. The member must be the map owner (member does not need to belong to the request organization).",
  params: deleteMapForMemberParams,
  response: deleteMapForMemberResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;

    await Maps.deleteForMember({
      mapId: request.params.map_id,
      memberId: request.params.member_id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
