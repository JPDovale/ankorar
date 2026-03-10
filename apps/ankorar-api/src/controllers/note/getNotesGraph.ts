import { Route } from "@/src/infra/shared/entities/Route";
import { getNotesGraphResponses } from "./getNotesGraph.gateway";

export const getNotesGraphRoute = Route.create({
  path: "/v1/notes/graph",
  method: "get",
  tags: ["Notes"],
  summary: "Get notes graph",
  description: "Get nodes and edges for notes graph visualization",
  response: getNotesGraphResponses,
  preHandler: [Route.canRequest("read:note")],
  handler: async (request, reply, { modules }) => {
    const { Notes } = modules.note;
    const member = request.context.member;

    const { nodes, edges } = await Notes.fns.findNotesGraphByMemberId({
      memberId: member.id,
    });

    return reply.status(200).send({
      status: 200,
      data: { nodes, edges },
    });
  },
});
