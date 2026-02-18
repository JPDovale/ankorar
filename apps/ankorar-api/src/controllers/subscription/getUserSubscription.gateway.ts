import z from "zod";

export const getUserSubscriptionResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      subscription_status: z.string().nullable(),
      stripe_price_id: z.string().nullable(),
      current_period_end: z.string().datetime().nullable(),
      limits: z.object({
        max_maps: z.number().nullable(),
        max_organizations_join: z.number(),
        max_organizations_create: z.number(),
        max_libraries: z.number().nullable(),
        ai_credits_per_month: z.number(),
      }),
      ai_credits: z.number(),
      ai_credits_reset_at: z.string().datetime().nullable(),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
