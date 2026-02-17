import { Route } from "@/src/infra/shared/entities/Route";
import { listMapsResponses } from "./listMaps.gateway";

export const listMapsRoute = Route.create({
  path: "/v1/maps",
  method: "get",
  tags: ["Maps"],
  summary: "List maps",
  description: "List maps from authenticated member",
  response: listMapsResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const member = request.context.member;

    const { maps } = await Maps.fns.findPreviewsByMemberId({
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
          likes_count: map.likes_count,
          preview: map.preview,
          generated_by_ai: map.generated_by_ai,
        })),
      },
    });
  },
});
