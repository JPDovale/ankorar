import z from "zod";

export const usersRecentQuery = z.object({
  period: z.enum(["7d", "30d"]).optional().default("30d"),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
});

export const usersRecentResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      counts: z.object({
        today: z.number(),
        last_7d: z.number(),
        last_30d: z.number(),
      }),
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
};
