import z from "zod";

export const listMapsResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      maps: z.array(
        z.object({
          id: z.uuidv7(),
          title: z.string().min(1).max(256).trim(),
          created_at: z.date(),
          updated_at: z.date().nullable(),
          likes_count: z.number().int().min(0),
          preview: z.string().nullable(),
        }),
      ),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
