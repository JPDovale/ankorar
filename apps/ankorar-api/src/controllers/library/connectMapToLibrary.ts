import { Route } from "@/src/infra/shared/entities/Route";
import {
  connectMapToLibraryParams,
  connectMapToLibraryResponses,
} from "./connectMapToLibrary.gateway";

export const connectMapToLibraryRoute = Route.create({
  path: "/v1/libraries/:library_id/maps/:map_id/connect",
  method: "post",
  tags: ["Libraries"],
  summary: "Connect map to library",
  description: "Connect map to a library from authenticated organization",
  params: connectMapToLibraryParams,
  response: connectMapToLibraryResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Libraries } = modules.library;
    const { Maps } = modules.map;
    const member = request.context.member;
    const organization = request.context.organization;

    await Maps.fns.findByIdAndMemberId({
      id: request.params.map_id,
      memberId: member.id,
    });

    await Libraries.connectMap({
      id: request.params.library_id,
      organizationId: organization.id,
      mapId: request.params.map_id,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
