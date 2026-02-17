import z from "zod";

export const listPlansResponse = z.object({
  status: z.number().min(200).max(200),
  data: z.object({
    plans: z.array(
      z.object({
        id: z.string(),
        price_id: z.string(),
        name: z.string(),
        amount: z.number(),
        interval: z.string(),
        features: z.array(z.string()),
      }),
    ),
  }),
});
