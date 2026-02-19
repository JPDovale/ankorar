import z from "zod";

export const openaiCostsResponse = {
  200: z.object({
    status: z.literal(200),
    data: z.object({
      total_amount: z.number(),
      currency: z.string(),
      by_line_item: z.record(z.string(), z.number()),
      by_day: z.array(
        z.object({
          date: z.string(),
          amount: z.number(),
        }),
      ),
      buckets_count: z.number(),
      error: z.string().optional(),
    }),
  }),
};
