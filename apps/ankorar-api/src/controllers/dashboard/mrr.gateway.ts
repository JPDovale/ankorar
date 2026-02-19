import z from "zod";

export const mrrResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      total_mrr_cents: z.number(),
      currency: z.string(),
      by_plan: z.array(
        z.object({
          price_id: z.string(),
          plan_name: z.string(),
          interval: z.string(),
          count: z.number(),
          amount_cents: z.number(),
          mrr_cents: z.number(),
        }),
      ),
    }),
  }),
};
