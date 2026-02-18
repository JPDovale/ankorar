import { Route } from "@/src/infra/shared/entities/Route";
import { getMapParams, getMapResponses } from "./getMap.gateway";

export const getMapRoute = Route.create({
  path: "/v1/maps/:map_id",
  method: "get",
  tags: ["Maps"],
  summary: "Get map by id",
  description: "Get a full map by id from authenticated organization",
  params: getMapParams,
  response: getMapResponses,
  preHandler: [Route.canRequest("read:map")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const organization = request.context.organization;
    const member = request.context.member;

    const { map } = await Maps.fns.findDetailsByIdAndOrganizationId({
      id: request.params.map_id,
      organizationId: organization.id,
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
          can_edit: map.can_edit,
          likes_count: map.likes_count,
          liked_by_me: map.liked_by_me,
        },
      },
    });
  },
});
