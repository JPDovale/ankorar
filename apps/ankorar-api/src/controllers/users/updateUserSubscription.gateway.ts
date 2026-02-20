import z from "zod";

export const updateUserSubscriptionParams = z.object({
  user_id: z.string().uuid(),
});

export const updateUserSubscriptionBody = z.object({
  price_id: z.string().min(1).nullable(),
});

export const updateUserSubscriptionResponses = {
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
