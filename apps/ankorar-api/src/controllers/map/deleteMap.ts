import { Route } from "@/src/infra/shared/entities/Route";
import { mapModule } from "@/src/models/map/MapModule";
import { deleteMapParams, deleteMapResponses } from "./deleteMap.gateway";

export const deleteMapRoute = Route.create({
  path: "/v1/maps/:map_id",
  method: "delete",
  tags: ["Maps"],
  summary: "Delete map",
  description: "Soft delete map from authenticated member",
  params: deleteMapParams,
  response: deleteMapResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Maps } = mapModule;
    const member = request.context.member;

    await Maps.delete({
      id: request.params.map_id,
      memberId: member.id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
