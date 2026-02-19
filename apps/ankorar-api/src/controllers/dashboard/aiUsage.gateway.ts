import z from "zod";

const planSlug = z.enum(["free", "basics", "premium", "master", "integration"]);

export const aiUsageResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      users_with_ai_in_period: z.number(),
      total_credits_consumed_current_period: z.number(),
      average_credits_per_user: z.number(),
      credits_remaining_total: z.number(),
      by_plan: z.array(
        z.object({
          plan_slug: planSlug,
          users_count: z.number(),
          limit_per_user: z.number(),
          total_consumed: z.number(),
          average_per_user: z.number(),
          credits_remaining_total: z.number(),
        }),
      ),
    }),
  }),
};
