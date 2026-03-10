import z from "zod";

export const getNoteResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      note: z.object({
        id: z.uuidv7(),
        title: z.string(),
        text: z.string(),
        created_at: z.date(),
        updated_at: z.date().nullable(),
        can_edit: z.boolean(),
        likes_count: z.number().int().min(0),
        liked_by_me: z.boolean(),
      }),
    }),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const getNoteParams = z.object({
  note_id: z.uuidv7(),
});
