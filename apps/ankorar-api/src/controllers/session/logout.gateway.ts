import z from "zod";

export const logoutResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  403: z.object({
    status: z.number().min(403).max(403),
    error: z.any(),
  }),
};
