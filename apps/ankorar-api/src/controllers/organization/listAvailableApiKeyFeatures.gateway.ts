import z from "zod";

export const listAvailableApiKeyFeaturesResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      features: z.array(z.string()),
    }),
  }),
};
