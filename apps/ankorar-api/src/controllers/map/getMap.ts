import { Route } from "@/src/infra/shared/entities/Route";
import { mapModule } from "@/src/models/map/MapModule";
import { getMapParams, getMapResponses } from "./getMap.gateway";

export const getMapRoute = Route.create({
  path: "/v1/maps/:map_id",
  method: "get",
  tags: ["Maps"],
  summary: "Get map by id",
  description: "Get a full map by id from authenticated member",
  params: getMapParams,
  response: getMapResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Maps } = mapModule;
    const member = request.context.member;

    const { map } = await Maps.fns.findByIdAndMemberId({
      id: request.params.map_id,
      memberId: member.id,
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
        },
      },
    });
  },
});
