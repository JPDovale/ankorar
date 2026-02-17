import z from "zod";

export const getUserSubscriptionResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z
      .object({
        subscription_status: z.string().nullable(),
        stripe_price_id: z.string().nullable(),
        current_period_end: z.string().datetime().nullable(),
      })
      .nullable(),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
