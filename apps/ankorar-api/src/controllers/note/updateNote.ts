import { Route } from "@/src/infra/shared/entities/Route";
import {
  updateNoteBody,
  updateNoteParams,
  updateNoteResponses,
} from "./updateNote.gateway";

export const updateNoteRoute = Route.create({
  path: "/v1/notes/:note_id",
  method: "patch",
  tags: ["Notes"],
  summary: "Update a note",
  description:
    "Update title and/or text of a note. Only the authenticated member who owns the note can update it.",
  params: updateNoteParams,
  body: updateNoteBody,
  response: updateNoteResponses,
  preHandler: [Route.canRequest("update:note")],
  handler: async (request, reply, { modules }) => {
    const { Notes } = modules.note;
    const member = request.context.member;

    await Notes.update({
      id: request.params.note_id,
      memberId: member.id,
      title: request.body.title,
      text: request.body.text,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
