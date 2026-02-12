import { Route } from "@/src/infra/shared/entities/Route";
import { mapModule } from "@/src/models/map/MapModule";
import { listMapsResponses } from "./listMaps.gateway";

export const listMapsRoute = Route.create({
  path: "/v1/maps",
  method: "get",
  tags: ["Maps"],
  summary: "List maps",
  description: "List maps from authenticated member",
  response: listMapsResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Maps } = mapModule;
    const member = request.context.member;

    const { maps } = await Maps.fns.findByMemberId({
      memberId: member.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        maps: maps.map((map) => ({
          id: map.id,
          title: map.title,
          created_at: map.created_at,
          updated_at: map.updated_at,
        })),
      },
    });
  },
});
