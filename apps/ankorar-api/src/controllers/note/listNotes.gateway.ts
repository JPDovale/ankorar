import z from "zod";

export const listNotesResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      notes: z.array(
        z.object({
          id: z.uuidv7(),
          title: z.string(),
          created_at: z.date(),
          updated_at: z.date().nullable(),
          likes_count: z.number().int().min(0),
        }),
      ),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
