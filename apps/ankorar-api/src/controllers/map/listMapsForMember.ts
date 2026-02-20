import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  listMapsForMemberParams,
  listMapsForMemberResponses,
} from "./listMapsForMember.gateway";

export const listMapsForMemberRoute = Route.create({
  path: "/v1/members/:member_id/maps",
  method: "get",
  tags: ["Maps"],
  summary: "List maps for member",
  description:
    "Lista os mapas mentais de um membro. O path deve conter o id do membro (member_id). O membro deve pertencer à organização do contexto. Requer permissão para leitura de mapas de outros membros.",
  params: listMapsForMemberParams,
  response: listMapsForMemberResponses,
  preHandler: [Route.canRequest("read:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member } = await Members.fns.findById({
      id: request.params.member_id,
    });

    if (member.org_id !== organization.id) {
      throw new MemberNotFound();
    }

    const { maps } = await Maps.fns.findPreviewsByMemberId({
      memberId: request.params.member_id,
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
