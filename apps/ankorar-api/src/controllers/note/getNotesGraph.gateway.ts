import z from "zod";

export const getNotesGraphResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      nodes: z.array(
        z.object({
          id: z.uuidv7(),
          title: z.string(),
        }),
      ),
      edges: z.array(
        z.object({
          from_note_id: z.uuidv7(),
          to_note_id: z.uuidv7(),
        }),
      ),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
