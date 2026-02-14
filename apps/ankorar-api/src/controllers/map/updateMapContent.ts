import { Route } from "@/src/infra/shared/entities/Route";
import { JsonValue } from "@/src/models/map/Maps/Map";
import { mapModule } from "@/src/models/map/MapModule";
import {
  updateMapContentBody,
  updateMapContentParams,
  updateMapContentResponses,
} from "./updateMapContent.gateway";

export const updateMapContentRoute = Route.create({
  path: "/v1/maps/:map_id/content",
  method: "put",
  bodyLimit: 25 * 1024 * 1024,
  tags: ["Maps"],
  summary: "Update map content",
  description: "Update full content nodes from authenticated member map",
  params: updateMapContentParams,
  body: updateMapContentBody,
  response: updateMapContentResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Maps } = mapModule;
    const member = request.context.member;
    const sanitizedContent = request.body.content as JsonValue[];

    await Maps.updateNodeContent({
      id: request.params.map_id,
      memberId: member.id,
      content: sanitizedContent,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
