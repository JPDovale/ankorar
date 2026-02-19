import z from "zod";

export const activityQuery = z.object({
  period: z.enum(["7", "30"]).optional().default("30"),
});

export const activityResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      period_days: z.number(),
      by_day: z.array(
        z.object({
          date: z.string(),
          users_created: z.number(),
          maps_created: z.number(),
          organizations_created: z.number(),
        }),
      ),
      total_users_created: z.number(),
      total_maps_created: z.number(),
      total_organizations_created: z.number(),
    }),
  }),
};
