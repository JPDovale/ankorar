import z from "zod";

export const overviewResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      total_users: z.number(),
      total_organizations: z.number(),
      total_maps: z.number(),
      users_created_today: z.number(),
      users_created_last_7d: z.number(),
      users_created_last_30d: z.number(),
      active_subscriptions: z.number(),
      canceled_subscriptions: z.number(),
    }),
  }),
};
