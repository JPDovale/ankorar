import z from "zod";

export const listLibrariesResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      libraries: z.array(
        z.object({
          id: z.uuidv7(),
          name: z.string().min(1).max(256).trim(),
          created_at: z.date(),
          updated_at: z.date().nullable(),
        }),
      ),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
