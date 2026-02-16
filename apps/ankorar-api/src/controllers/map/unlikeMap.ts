import { Route } from "@/src/infra/shared/entities/Route";
import { unlikeMapParams, unlikeMapResponses } from "./unlikeMap.gateway";

export const unlikeMapRoute = Route.create({
  path: "/v1/maps/:map_id/like",
  method: "delete",
  tags: ["Maps"],
  summary: "Unlike map",
  description: "Remove like from map for the authenticated member.",
  params: unlikeMapParams,
  response: unlikeMapResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const member = request.context.member;

    const { mapLike } = await Maps.unlike({
      mapId: request.params.map_id,
      memberId: member.id,
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
