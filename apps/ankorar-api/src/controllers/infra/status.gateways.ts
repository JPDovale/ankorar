import z from "zod";

export const statusResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      updated_at: z.string(),
      dependencies: z.object({
        database: z.object({
          version: z.string(),
          max_connections: z.number(),
          opened_connections: z.number(),
        }),
      }),
    }),
  }),
};
