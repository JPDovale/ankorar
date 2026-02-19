import z from "zod";

export const subscriptionsResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      by_status: z.array(
        z.object({ status: z.string(), count: z.number() }),
      ),
      by_plan: z.array(
        z.object({
          stripe_price_id: z.string().nullable(),
          plan_slug: z.string(),
          count: z.number(),
        }),
      ),
    }),
  }),
};
