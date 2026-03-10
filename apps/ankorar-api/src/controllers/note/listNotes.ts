import { Route } from "@/src/infra/shared/entities/Route";
import { listNotesResponses } from "./listNotes.gateway";

export const listNotesRoute = Route.create({
  path: "/v1/notes",
  method: "get",
  tags: ["Notes"],
  summary: "List notes preview",
  description: "List notes with preview info for the authenticated member",
  response: listNotesResponses,
  preHandler: [Route.canRequest("read:note")],
  handler: async (request, reply, { modules }) => {
    const { Notes } = modules.note;
    const member = request.context.member;

    const { notes } = await Notes.fns.findPreviewsByMemberId({
      memberId: member.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        notes: notes.map((note) => ({
          id: note.id,
          title: note.title,
          created_at: note.created_at,
          updated_at: note.updated_at,
          likes_count: note.likes_count,
        })),
      },
    });
  },
});
