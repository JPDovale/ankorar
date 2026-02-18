import { Route } from "@/src/infra/shared/entities/Route";
import { deleteMapParams, deleteMapResponses } from "./deleteMap.gateway";

export const deleteMapRoute = Route.create({
  path: "/v1/maps/:map_id",
  method: "delete",
  tags: ["Maps"],
  summary: "Delete map",
  description: "Soft delete map from authenticated member",
  params: deleteMapParams,
  response: deleteMapResponses,
  preHandler: [Route.canRequest("delete:map")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
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
