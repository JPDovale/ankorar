import z from "zod";

export const listApiKeysResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      api_keys: z.array(
        z.object({
          id: z.string(),
          prefix: z.string(),
          env: z.string(),
          features: z.array(z.string()),
          created_at: z.date(),
          last_used_at: z.date(),
          revoked_at: z.date().nullable(),
          expires_at: z.date().nullable(),
        }),
      ),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};
