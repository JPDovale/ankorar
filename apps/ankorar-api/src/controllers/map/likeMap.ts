import { Route } from "@/src/infra/shared/entities/Route";
import { likeMapParams, likeMapResponses } from "./likeMap.gateway";

export const likeMapRoute = Route.create({
  path: "/v1/maps/:map_id/like",
  method: "post",
  tags: ["Maps"],
  summary: "Like map",
  description:
    "Mark map as liked by the authenticated member. Only allowed for maps that are not owned by the member.",
  params: likeMapParams,
  response: likeMapResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const member = request.context.member;
    const organization = request.context.organization;

    const { mapLike } = await Maps.like({
      mapId: request.params.map_id,
      memberId: member.id,
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
