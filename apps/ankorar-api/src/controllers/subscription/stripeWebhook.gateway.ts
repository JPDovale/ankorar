import z from "zod";

export const stripeWebhookResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({ received: z.boolean() }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  500: z.object({
    status: z.number().min(500).max(500),
    error: z.any(),
  }),
};
