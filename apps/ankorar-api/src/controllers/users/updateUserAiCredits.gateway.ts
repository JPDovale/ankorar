import z from "zod";

export const updateUserAiCreditsParams = z.object({
  user_id: z.string().uuid(),
});

export const updateUserAiCreditsBody = z.object({
  ai_credits: z.number().int().min(0),
  never_expire: z.boolean().optional().default(false),
});

export const updateUserAiCreditsResponses = {
  204: z.object({
    status: z.literal(204),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};
