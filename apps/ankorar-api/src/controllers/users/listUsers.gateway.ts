import z from "zod";

export const listUsersQuery = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const listUsersResponses = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      users: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          created_at: z.date(),
          subscription_status: z.string().nullable(),
          stripe_price_id: z.string().nullable(),
        }),
      ),
      total: z.number(),
    }),
  }),
  401: z.object({
    status: z.number().min(401).max(401),
    error: z.any(),
  }),
};
