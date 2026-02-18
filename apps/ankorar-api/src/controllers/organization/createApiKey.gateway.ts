import z from "zod";

export const createApiKeyBody = z.object({
  expires_at: z.string().optional().nullable(),
  features: z.array(z.string().min(1)).min(1).optional(),
});

export const createApiKeyResponses = {
  201: z.object({
    status: z.number().min(201).max(201),
    data: z.object({
      api_key: z.string(),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};
