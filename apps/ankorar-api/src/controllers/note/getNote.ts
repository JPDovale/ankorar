import { Route } from "@/src/infra/shared/entities/Route";
import { getNoteParams, getNoteResponses } from "./getNote.gateway";

export const getNoteRoute = Route.create({
  path: "/v1/notes/:note_id",
  method: "get",
  tags: ["Notes"],
  summary: "Get note by id",
  description:
    "Get full note details by id. Only the authenticated member who owns the note can access it.",
  params: getNoteParams,
  response: getNoteResponses,
  preHandler: [Route.canRequest("read:note")],
  handler: async (request, reply, { modules }) => {
    const { Notes } = modules.note;
    const member = request.context.member;

    const { note } = await Notes.fns.findDetailsByIdAndMemberId({
      id: request.params.note_id,
      memberId: member.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        note: {
          id: note.id,
          title: note.title,
          text: note.text,
          created_at: note.created_at,
          updated_at: note.updated_at,
          can_edit: note.can_edit,
          likes_count: note.likes_count,
          liked_by_me: note.liked_by_me,
        },
      },
    });
  },
});
