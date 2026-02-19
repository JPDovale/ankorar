import z from "zod";

export const churnResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      by_status: z.record(z.string(), z.number()),
      active_count: z.number(),
      canceled_count: z.number(),
      trialing_count: z.number(),
      past_due_count: z.number(),
      total_with_plan: z.number(),
      churn_rate: z.number(),
    }),
  }),
};
