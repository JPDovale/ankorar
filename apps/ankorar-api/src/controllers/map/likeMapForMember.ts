import { Route } from "@/src/infra/shared/entities/Route";
import {
  likeMapForMemberParams,
  likeMapForMemberResponses,
} from "./likeMapForMember.gateway";

export const likeMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id/like",
  method: "post",
  tags: ["Maps"],
  summary: "Like map for member",
  description:
    "Marca o mapa como curtido pelo membro (member_id). O membro deve pertencer à organização do contexto. Não é permitido curtir o próprio mapa.",
  params: likeMapForMemberParams,
  response: likeMapForMemberResponses,
  preHandler: [Route.canRequest("like:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const organization = request.context.organization;

    const { mapLike } = await Maps.likeForMember({
      memberId: request.params.member_id,
      mapId: request.params.map_id,
      organizationId: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        map_like: {
          id: mapLike.id,
          map_id: mapLike.map_id,
          member_id: mapLike.member_id,
          created_at: mapLike.created_at,
        },
      },
    });
  },
});
