import z from "zod";

export const getUserByIdParams = z.object({
  user_id: z.string().uuid(),
});

export const getUserByIdResponses = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        created_at: z.date(),
        updated_at: z.date().nullable(),
        subscription_status: z.string().nullable(),
        stripe_price_id: z.string().nullable(),
        stripe_customer_id: z.string().nullable(),
        ai_credits: z.number(),
        ai_credits_reset_at: z.date().nullable(),
      }),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};
