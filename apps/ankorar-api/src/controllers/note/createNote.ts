import { Route } from "@/src/infra/shared/entities/Route";
import { createNoteBody, createNoteResponses } from "./createNote.gateway";

export const createNoteRoute = Route.create({
  path: "/v1/notes",
  method: "post",
  tags: ["Notes"],
  summary: "Create a note",
  description: "Create a note for authenticated member (title and text)",
  body: createNoteBody,
  response: createNoteResponses,
  preHandler: [Route.canRequest("create:note")],
  handler: async (request, reply, { modules }) => {
    const { Notes } = modules.note;
    const member = request.context.member;

    await Notes.create({
      member_id: member.id,
      title: request.body.title,
      text: request.body.text,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
