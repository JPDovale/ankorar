import { Route } from "@/src/infra/shared/entities/Route";
import { JsonValue } from "@/src/models/map/Maps/Map";
import {
  updateMapForOwnerBody,
  updateMapForOwnerParams,
  updateMapForOwnerResponses,
} from "./updateMapForOwner.gateway";

export const updateMapForOwnerRoute = Route.create({
  path: "/v1/maps/for-owner/:map_id/content",
  method: "put",
  bodyLimit: 25 * 1024 * 1024,
  tags: ["Maps"],
  summary: "Update map content for owner",
  description:
    "Atualiza conteúdo e preview do mapa do owner da organização. Requer update:map:other.",
  params: updateMapForOwnerParams,
  body: updateMapForOwnerBody,
  response: updateMapForOwnerResponses,
  preHandler: [Route.canRequest("update:map:other")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Members } = modules.organization;
    const organization = request.context.organization;
    const sanitizedContent = request.body.content as JsonValue[];
    const preview = request.body.preview as string | undefined;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    await Maps.updateForMember({
      mapId: request.params.map_id,
      memberId: ownerMember.id,
      organizationId: organization.id,
      content: sanitizedContent,
      preview,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
