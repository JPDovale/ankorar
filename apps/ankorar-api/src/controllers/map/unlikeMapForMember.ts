import { Route } from "@/src/infra/shared/entities/Route";
import {
  unlikeMapForMemberParams,
  unlikeMapForMemberResponses,
} from "./unlikeMapForMember.gateway";

export const unlikeMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id/like",
  method: "delete",
  tags: ["Maps"],
  summary: "Unlike map for member",
  description:
    "Remove a curtida do mapa pelo membro (member_id). O membro deve pertencer à organização do contexto.",
  params: unlikeMapForMemberParams,
  response: unlikeMapForMemberResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const organization = request.context.organization;

    const { mapLike } = await Maps.unlikeForMember({
      memberId: request.params.member_id,
      mapId: request.params.map_id,
      organizationId: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        map_like: mapLike
          ? {
              id: mapLike.id,
              map_id: mapLike.map_id,
              member_id: mapLike.member_id,
              created_at: mapLike.created_at,
            }
          : null,
      },
    });
  },
});
