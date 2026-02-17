import { Route } from "@/src/infra/shared/entities/Route";
import {
  getMapForMemberParams,
  getMapForMemberResponses,
} from "./getMapForMember.gateway";

export const getMapForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps/:map_id",
  method: "get",
  tags: ["Maps"],
  summary: "Get map by id for member",
  description:
    "Retorna os detalhes do mapa. O path deve conter o id do membro dono do mapa (member_id) e o id do mapa (map_id). O mapa só é retornado se pertencer a esse membro.",
  params: getMapForMemberParams,
  response: getMapForMemberResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;

    const { map } = await Maps.fns.findDetailsByIdAndMemberId({
      id: request.params.map_id,
      ownerMemberId: request.params.member_id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        map: {
          id: map.id,
          title: map.title,
          content: map.content,
          created_at: map.created_at,
          updated_at: map.updated_at,
          can_edit: map.can_edit,
          likes_count: map.likes_count,
          liked_by_me: map.liked_by_me,
        },
      },
    });
  },
});
