import z from "zod";

export const createCustomerPortalSessionResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.object({
      url: z.string().url(),
    }),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
};
