import { Route } from "@/src/infra/shared/entities/Route";
import {
  getMapForOwnerParams,
  getMapForOwnerResponses,
} from "./getMapForOwner.gateway";

export const getMapForOwnerRoute = Route.create({
  path: "/v1/maps/for-owner/:map_id",
  method: "get",
  tags: ["Maps"],
  summary: "Get map by id for owner",
  description:
    "Retorna os detalhes do mapa do owner da organização. Requer read:map:other.",
  params: getMapForOwnerParams,
  response: getMapForOwnerResponses,
  preHandler: [Route.canRequest("read:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    const { map } = await Maps.fns.findDetailsByIdAndMemberId({
      id: request.params.map_id,
      ownerMemberId: ownerMember.id,
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
